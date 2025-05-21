"use client";

import { DynamicElement } from "@/app/ui/create/dynamicElement";
import { useState, useCallback } from "react";
import { IElement, IOtherData } from "@/app/types/index";
import { createPage, updatePage } from "@/app/lib/data";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  pointerWithin,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { createSnapModifier } from "@dnd-kit/modifiers";
import {
  SortableContext,
  rectSwappingStrategy,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { MeasuringStrategy } from "@dnd-kit/core";
import { Draggable } from "@/app/ui/create/draggable";
import { Droppable } from "@/app/ui/create/droppable";
import { Sortable } from "@/app/ui/create/sortable";
import { useRef, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { elements, styles } from "@/app/utils/constants";
import { Resizable, ResizeCallback } from "re-resizable";
import FloatingToolbar from "@/app/ui/create/floatingToolbar";
import { getPage } from "@/app/lib/data";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { validatePosition } from "@/app/utils/blogEditorHelpers/validatePosition";
import { swapPositions } from "@/app/utils/blogEditorHelpers/swapPositions";
import { updatePosition } from "@/app/utils/blogEditorHelpers/updatePosition";
import { getResizableStyle } from "@/app/utils/blogEditorHelpers/getResizableStyle";
import { getEnabledResizeHandles } from "@/app/utils/blogEditorHelpers/getEnabledResizeHandles";
import { updateParentMargin } from "@/app/utils/blogEditorHelpers/updateParentMargin";
import { calculateDelta } from "@/app/utils/blogEditorHelpers/calculateDelta";
import { updateCompSize } from "@/app/utils/blogEditorHelpers/updateCompSize";

interface IBlogPageEditor {
  edit: boolean;
}

export default function BlogPageEditor(props: IBlogPageEditor) {
  const [addedContent, setAddedContent] = useState<IElement[]>([]);
  const [showSelect, setShowSelect] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [draggingComponentId, setDraggingComponentId] = useState<number>(null);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [navBarSize, setNavBarSize] = useState<{ size: number; marginDirection: string }>(
    {}
  );
  const [posState, setPosState] = useState<string>();
  const [screenSize, setScreenSize] = useState<{ [name: string]: number }>({
    width: window?.innerWidth,
    height: window?.innerHeight,
    initialWidth: window?.innerWidth,
    initialHeight: window?.innerHeight,
    deltaX: 0,
    deltaY: 0,
  });
  const [tempSizeDelta, setTempSizeDelta] = useState<{ [name: string]: number | null }>({
    width: 0,
    height: 0,
    id: null,
  });
  const [parentMargin, setParentMargin] = useState<{ [name: string]: number }>({});
  const [selectedComponent, setSelectedComponent] = useState<{
    id: number | null;
    isMovable: boolean | null;
  }>({
    id: null,
    isMovable: null,
  });
  const [shouldCheckForCollision, setShouldCheckForCollision] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navBarSizeRef = useRef<HTMLDivElement>(null);
  const parentComponentsRef = useRef(null);
  const draggableRef = useRef<HTMLDivElement>(null);
  const componentRefs = useRef<Map<string, HTMLDivElement>>({});
  const params = useParams<string>();
  const { toast } = useToast();

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 5 pixels before activating
    activationConstraint: {
      distance: 5,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 100ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });
  const sensors = useSensors(
    mouseSensor,
    touchSensor
    // keyboardSensor
  );
  const gridSize = 20; // pixels
  const snapToGridModifier = createSnapModifier(gridSize);

  useEffect(() => {
    let isDataFetched = false;

    const fetchPageData = async () => {
      if (params && props.edit) {
        setIsLoading(true);
        try {
          const data = await getPage(params.slug);
          if (!isDataFetched) {
            setAddedContent(data.data);
          }
        } catch (error) {
          if (!isDataFetched) {
            console.error("Failed to fetch data", error);
          }
        }
        setIsLoading(false);
      }
    };

    fetchPageData();
    return () => {
      isDataFetched = true;
    };
  }, [props.edit, params]);

  useEffect(() => {
    if (posState == "Right") {
      setNavBarSize({
        size: navBarSizeRef.current?.offsetWidth,
        marginDirection: "marginRight",
      });
    } else if (posState == "Bottom") {
      setNavBarSize({
        size: navBarSizeRef.current?.offsetHeight,
        marginDirection: "marginBottom",
      });
    } else if (posState == "Top") {
      setNavBarSize({
        size: navBarSizeRef.current?.offsetHeight,
        marginDirection: "marginTop",
      });
    } else if (posState == "Left") {
      setNavBarSize({
        size: navBarSizeRef.current?.offsetWidth,
        marginDirection: "marginLeft",
      });
    }
    updateParentMargin(setParentMargin, componentRefs);
  }, [posState]);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        ...screenSize,
        width: window.innerWidth,
        height: window.innerHeight,
        deltaX: window.innerWidth - screenSize.initialWidth,
        deltaY: window.innerHeight - screenSize.initialHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [screenSize]);

  const handlePositionChange = async (pos: string) => {
    if (pos === posState) {
      return;
    }
    setNavBarSize(null);
    setPosState(pos);

    const positionClasses = [
      {
        position: "Right",
        // className: "inset-y-0 right-0 min-w-80 min-h-screen place-items-center",
        className: "inset-y-0 right-0 w-80 h-screen place-items-center",
        size: { minWidth: "64px", minHeight: "100vh", height: "100vh", width: "325px" },
      },
      {
        position: "Bottom",
        className:
          "flex-row inset-x-0 bottom-0 h-28 w-screen place-items-start px-8 mt-20",
        size: { minWidth: "100vh", minHeight: "48px", height: "128px", width: "100vw" },
      },
      {
        position: "Top",
        className: "flex-row inset-x-0 top-0 h-28 w-screen place-items-start px-8 mb-20",
        size: {
          minWidth: "100vh",
          minHeight: "48px",
          height: "128px",
          width: "100vw",
        },
      },
      {
        position: "Left",
        // className: "inset-y-0 left-0 min-w-80 min-h-screen place-items-center",
        className: "inset-y-0 left-0 w-80 h-screen place-items-center",
        size: { minWidth: "64px", minHeight: "100vh", height: "100vh", width: "325px" },
      },
    ];

    const { position, className, size } = positionClasses.find(
      (item) => item.position === pos
    );

    setAddedContent((prevAddedContent) => {
      return prevAddedContent.map((component) => {
        if (component.tag === "nav bar") {
          return {
            ...component,
            positionClass: className,
            position: { ...component.position, placement: position },
            size: {
              deltaWidth: 0,
              deltaHeight: 0,
              width: size.width,
              height: size.height,
              minWidth: size.minWidth,
              minHeight: size.minHeight,
            },
          };
        }
        return component;
      });
    });
    await updateParentMargin(setParentMargin, componentRefs);
  };

  const handlePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  const handleGridMode = () => {
    setShowGrid(!showGrid);
  };

  const handleSelect = () => {
    setShowSelect(!showSelect);
  };

  const handleSelectComponent = (compId: number | null) => {
    if (compId == null) {
      setSelectedComponent({ id: null, isMovable: null });
      return;
    }

    const comp = addedContent.find((comp) => comp.id === compId);
    setSelectedComponent({ id: compId, isMovable: comp.isMovable });
  };

  const handleCreatePage = () => {
    createPage(addedContent, { parentMargin: parentMargin } as IOtherData);
  };
  const handleUpdatePage = () => {
    updatePage(addedContent, { parentMargin: parentMargin } as IOtherData);
  };

  const shouldCreateOrUpdate = () => {
    if (props.edit) {
      handleUpdatePage();
    } else {
      handleCreatePage();
    }
  };

  const handleSubmit = async (elementId: number) => {
    let elementToBeAdded: Element;
    elements.map((item) => {
      if (item.componentId == elementId) {
        elementToBeAdded = {
          ...item,
        };
        elementToBeAdded.id = addedContent.length;
        elementToBeAdded.gridId = "mainGrid";
      }
    });
    setAddedContent((prevContent) => [...prevContent, elementToBeAdded]);

    if (elementToBeAdded.tag === "nav bar") {
      await handlePositionChange("Left"); // default value
    }

    await updateParentMargin(setParentMargin, componentRefs);
    setShowSelect(false);
  };

  const handleDelete = (elementToDelete: IElement) => {
    const updatedContent = addedContent.filter(
      (element) => element.id != elementToDelete.id
    );
    setAddedContent([...updatedContent]);
  };

  // const handleShowDelete = (state: boolean) => {
  //   setShowDelete(state);
  // };

  const handleDragStart = (event: DragEndEvent) => {
    if (tempSizeDelta.id === event.active.id) {
      return;
    }
    setDraggingComponentId(event.active.id);
  };

  const handleDragCancel = () => {
    setDraggingComponentId(null);
    return;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { activatorEvent, active, collisions, delta, over } = event;

    // if (tempSizeDelta.id === event.active.id) {
    //   return;
    // }

    if (active === null || over === null) {
      toast({
        title: "Uh oh! Position invalid.",
        description: "The component was dropped out of bounds.",
        className: "bg-yellow-100 border-yellow-300 m-2",
      });
      return;
    }

    const elementId = active.id as string;
    const newStatus = over.id as string | number;
    const draggedComponent = addedContent.find((item) => item.id === elementId);
    const isParentComponent = addedContent.find(
      (component) => component.id == newStatus && component.dnd == "Droppable"
    );

    const isPositionValid = validatePosition(
      delta,
      draggedComponent,
      screenSize,
      parentMargin,
      isParentComponent
    );

    if (!isPositionValid) {
      return toast({
        title: "Uh oh! Position invalid.",
        description: "The component was dropped out of bounds.",
        className: "bg-yellow-100 border-yellow-300 m-2",
      });
      return;
    }

    if (draggedComponent.parentId !== null && collisions.length >= 2) {
      return;
    }

    // handles the swapping of components (if elementId == newStatus, it just means the component has been moved, and not swapped)
    if (
      collisions.length >= 2 &&
      elementId !== newStatus &&
      !isNaN(newStatus) &&
      !isParentComponent
    ) {
      swapPositions(addedContent, setAddedContent, draggedComponent, newStatus);
    } else {
      updatePosition(setAddedContent, elementId, newStatus, delta);
      setShouldCheckForCollision(true);
    }
  };

  const handleInputChange = (id: number, text: string) => {
    setAddedContent((prevAddedContent) => {
      return prevAddedContent.map((component) => {
        if (component.id === id) {
          return {
            ...component,
            input: text,
          };
        }
      });
    });
  };

  const handleUpdateCompSize = (compId: number, d: ResizeCallback.delta) => {
    updateCompSize(
      findResizingComponent(),
      isResizingCompColliding,
      compId,
      d,
      calculateDelta,
      setAddedContent
    );
    setTempSizeDelta({ height: 0, width: 0, id: null });
    updateParentMargin(setParentMargin, componentRefs);
  };

  const toggleComponentDraggable = () => {
    setAddedContent((prevAddedContent) => {
      return prevAddedContent.map((component) => {
        if (component.id === selectedComponent.id && component.disabled !== null) {
          return {
            ...component,
            disabled: !component.disabled,
          };
        }
        return component;
      });
    });
  };

  const findResizingComponent = useCallback(() => {
    if (tempSizeDelta.id == null) {
      return;
    }

    const currentResizingComp = addedContent.find((item) => item.id == tempSizeDelta.id);
    return currentResizingComp;
  }, [addedContent, tempSizeDelta.id]);

  const roughlyNearbyComponents = useMemo(() => {
    const currentResizingComp = findResizingComponent();
    if (!currentResizingComp) {
      return;
    }
    const nearbyDistance = 200;

    const nearbyComponents = addedContent.filter(
      (item) =>
        currentResizingComp.position.x < item.position.x + item.size.width &&
        currentResizingComp.position.x + currentResizingComp.size.width + nearbyDistance >
          item.position.x &&
        currentResizingComp.position.y < item.position.y + item.size.height &&
        currentResizingComp.position.y +
          currentResizingComp.size.height +
          nearbyDistance >
          item.position.y &&
        item.id !== currentResizingComp.id
    );
    return nearbyComponents;
  }, [addedContent, findResizingComponent]);

  const isResizingCompColliding = useCallback(
    (currentResizingComp) => {
      const { height: heightDelta, width: widthDelta } = tempSizeDelta;

      if (!roughlyNearbyComponents || roughlyNearbyComponents.length < 1) {
        return;
      }

      const collidingComponents = roughlyNearbyComponents.filter(
        (item) =>
          currentResizingComp.position.x < item.position.x + item.size.width &&
          currentResizingComp.position.x + currentResizingComp.size.width + widthDelta >
            item.position.x &&
          currentResizingComp.position.y < item.position.y + item.size.height &&
          currentResizingComp.position.y + currentResizingComp.size.height + heightDelta >
            item.position.y &&
          item.id !== currentResizingComp.id
      );
      return collidingComponents;
    },
    [roughlyNearbyComponents, tempSizeDelta]
  );

  const isCompColliding = useCallback(
    (comp, deltaX, deltaY, currentResizingComp) => {
      const collidingComponents = addedContent.filter(
        (item) =>
          comp.position.x < item.position.x + item.size.width &&
          comp.position.x + comp.size.width + deltaX > item.position.x &&
          comp.position.y < item.position.y + item.size.height &&
          comp.position.y + comp.size.height + deltaY > item.position.y &&
          item.id !== comp.id &&
          item.id !== currentResizingComp
      );
      return collidingComponents;
    },
    [addedContent]
  );

  const shouldResizeOrMove = useCallback(
    (item, deltaX, deltaY, adjacentComp) => {
      const { marginTop, marginBottom, marginLeft, marginRight } = parentMargin;
      const { width: screenWidth, height: screenHeight } = screenSize;

      const isHorizontalAdjustment = deltaX <= deltaY;
      const isVerticalAdjustment = deltaY < deltaX;

      const isMinSize =
        (item.size.width - deltaX < item.size.minWidth && isHorizontalAdjustment) ||
        (item.size.height - deltaY < item.size.minHeight && isVerticalAdjustment);

      const isOutOfScreen =
        (item.position.x + item.size.width + deltaX >
          screenWidth - (marginLeft + marginRight) &&
          isHorizontalAdjustment) ||
        (item.position.y + item.size.height + deltaY >
          screenHeight - (marginTop + marginBottom) &&
          isVerticalAdjustment);

      if (adjacentComp) {
        const isAdjacentCompOutOfScreen =
          (adjacentComp.position.x + adjacentComp.size.width + deltaX >
            screenWidth - (marginLeft + marginRight) &&
            isHorizontalAdjustment) ||
          (adjacentComp.position.y + adjacentComp.size.height + deltaY >
            screenHeight - (marginTop + marginBottom) &&
            isVerticalAdjustment);

        if (isMinSize) {
          return null;
        } else if (!isAdjacentCompOutOfScreen) {
          return false;
        } else {
          return true;
        }
      }

      if (isMinSize && isOutOfScreen) {
        return null;
      }

      return isOutOfScreen;
    },
    [parentMargin, screenSize]
  );

  const isCollidingAfterUpdate = useCallback(() => {
    const comp = addedContent.find((comp) => comp.id === draggingComponentId);
    if (comp) {
      const isColliding = isCompColliding(comp, 0, 0, null);
      let deltaX = 0;
      let deltaY = 0;
      if (isColliding && isColliding.length > 0) {
        for (const collidingComp of isColliding) {
          let compDeltaX = calculateDelta(comp, collidingComp, 0, "X");
          let compDeltaY = calculateDelta(comp, collidingComp, 0, "Y");

          compDeltaX =
            comp.position.x < collidingComp.position.x ? -compDeltaX : compDeltaX;
          compDeltaY =
            comp.position.y < collidingComp.position.y ? -compDeltaY : compDeltaY;

          const totalDeltaX = compDeltaX > 0 ? compDeltaX + deltaX : compDeltaX - deltaX;
          const totalDeltaY = compDeltaY > 0 ? compDeltaY + deltaY : compDeltaY - deltaY;

          const isStillColliding = isCompColliding(comp, totalDeltaX, totalDeltaY, null);

          if (isStillColliding.length === 0) {
            deltaX = totalDeltaX;
            deltaY = totalDeltaY;
            break;
          }

          const leftCollision = compDeltaX < 0;
          const rightCollision = compDeltaX > 0;
          const topCollision = compDeltaY < 0;
          const bottomCollision = compDeltaY > 0;

          if (leftCollision) {
            deltaX -= compDeltaX;
          } else if (rightCollision) {
            deltaX += compDeltaX;
          } else if (leftCollision && rightCollision) {
            deltaX = 0;
          }

          if (topCollision) {
            deltaY -= compDeltaY;
          } else if (bottomCollision) {
            deltaY += compDeltaY;
          } else if (topCollision && bottomCollision) {
            deltaY = 0;
          }
        }

        const isDeltaEnough = isCompColliding(comp, deltaX, deltaY, null);
        const maxPixelsAdded = 150;
        let pixelsAdded = 0;

        while (isDeltaEnough.length > 0 && maxPixelsAdded <= pixelsAdded) {
          deltaX += deltaX > 0 ? 10 : -10;
          deltaY += deltaY > 0 ? 10 : -10;
          pixelsAdded += 10;
          const check = isCompColliding(comp, deltaX, deltaY, null);
          if (check.length === 0) {
            break;
          }
        }

        // const currentAxis = Math.abs(deltaX) < Math.abs(deltaY) ? "x" : "y";
        const currentAxis = deltaX < deltaY ? "x" : "y";

        setAddedContent((prevAddedContent) => {
          return prevAddedContent.map((component) => {
            if (component.id === comp.id) {
              return {
                ...component,
                position: {
                  ...component.position,
                  x:
                    currentAxis === "x"
                      ? component.position.x + deltaX
                      : component.position.x,
                  y:
                    currentAxis === "y"
                      ? component.position.y + deltaY
                      : component.position.y,
                },
              };
            }
            return component;
          });
        });
      }
    }
  }, [addedContent, draggingComponentId, isCompColliding]);

  useEffect(() => {
    if (shouldCheckForCollision) {
      isCollidingAfterUpdate();
      setShouldCheckForCollision(false);
    }
  }, [addedContent, isCollidingAfterUpdate, shouldCheckForCollision]);

  useEffect(() => {
    const { height: heightDelta, width: widthDelta, id: idDelta } = tempSizeDelta;

    if (idDelta !== null) {
      const currentResizingComp = findResizingComponent();
      const collidingComponents = isResizingCompColliding(currentResizingComp);

      if (
        !currentResizingComp ||
        (collidingComponents && collidingComponents.length < 1)
      ) {
        return;
      }

      // const interval = setInterval(() => {
      if (collidingComponents) {
        setAddedContent((prevAddedContent) => {
          const updatedContent = [...prevAddedContent];
          let didChange = false;

          for (let i = 0; i < updatedContent.length; i++) {
            const item = updatedContent[i];
            const isColliding = collidingComponents.find((comp) => comp.id === item.id);

            if (isColliding) {
              const deltaX = calculateDelta(currentResizingComp, item, widthDelta, "X");
              const deltaY = calculateDelta(currentResizingComp, item, heightDelta, "Y");

              const isCollidingWithOtherComps = isCompColliding(
                item,
                deltaX,
                deltaY,
                currentResizingComp.id
              );
              let availableDeltaX = 0;
              let availableDeltaY = 0;
              let collidingCompIndex = null;

              if (isCollidingWithOtherComps) {
                isCollidingWithOtherComps.forEach((otherComp) => {
                  const index = updatedContent.findIndex((c) => c.id === otherComp.id);
                  if (index !== -1) {
                    const collidingComp = updatedContent[index];
                    collidingCompIndex = index;

                    const resizeOrMove = shouldResizeOrMove(
                      collidingComp,
                      deltaX,
                      deltaY
                    );

                    if (
                      resizeOrMove &&
                      collidingComp.size.width - deltaX < collidingComp.size.minWidth
                    ) {
                      availableDeltaX =
                        collidingComp.size.width - collidingComp.size.minWidth;
                    }

                    if (
                      resizeOrMove &&
                      collidingComp.size.height - deltaY < collidingComp.size.minHeight
                    ) {
                      availableDeltaY =
                        collidingComp.size.height - collidingComp.size.minHeight;
                    }

                    if (resizeOrMove === null) {
                      return;
                    }

                    const currentAxis = deltaX <= deltaY ? "x" : "y";

                    // TODO when resizing on the Y axis, there's a case where deltaX == deltaY
                    const adjustWidth = currentAxis === "x" && resizeOrMove;
                    const adjustHeight = currentAxis === "y" && resizeOrMove;

                    const moveX = currentAxis === "x" && !resizeOrMove;
                    const moveY = currentAxis === "y" && !resizeOrMove;

                    updatedContent[index] = {
                      ...collidingComp,
                      size: {
                        ...collidingComp.size,
                        width: adjustWidth
                          ? collidingComp.size.width - deltaX
                          : collidingComp.size.width,
                        height: adjustHeight
                          ? collidingComp.size.height - deltaY
                          : collidingComp.size.height,
                      },
                      position: {
                        ...collidingComp.position,
                        x: moveX
                          ? collidingComp.position.x + deltaX
                          : collidingComp.position.x,
                        y: moveY
                          ? collidingComp.position.y + deltaY
                          : collidingComp.position.y,
                      },
                    };
                    didChange = true;
                  }
                });
              }

              const finalDeltaX = availableDeltaX > 0 ? availableDeltaX : deltaX;
              const finalDeltaY = availableDeltaY > 0 ? availableDeltaY : deltaY;
              const adjacentComp = updatedContent[collidingCompIndex];

              const resizeOrMove = shouldResizeOrMove(
                item,
                finalDeltaX,
                finalDeltaY,
                adjacentComp
              );

              if (resizeOrMove === null) {
                continue;
              }

              const currentAxis = finalDeltaX <= finalDeltaY ? "x" : "y";
              const shouldAdjustWidth = currentAxis === "x" && resizeOrMove;
              const shouldAdjustHeight = currentAxis === "y" && resizeOrMove;
              const shouldMoveX = currentAxis === "x" && !resizeOrMove;
              const shouldMoveY = currentAxis === "y" && !resizeOrMove;

              updatedContent[i] = {
                ...item,
                size: {
                  ...item.size,
                  width: shouldAdjustWidth
                    ? item.size.width - finalDeltaX
                    : item.size.width,
                  height: shouldAdjustHeight
                    ? item.size.height - finalDeltaY
                    : item.size.height,
                },
                position: {
                  ...item.position,
                  x: shouldMoveX ? item.position.x + finalDeltaX : item.position.x,
                  y: shouldMoveY ? item.position.y + finalDeltaY : item.position.y,
                },
              };
              didChange = true;
            }
          }
          if (!didChange) return prevAddedContent;
          return updatedContent;
        });
      }
    }

    // }, 50);
    // return () => clearInterval(interval);
  }, [
    findResizingComponent,
    isCompColliding,
    isResizingCompColliding,
    shouldResizeOrMove,
    tempSizeDelta,
  ]);

  return (
    // TODO remove flex-col?
    // <div className="flex h-screen w-full relative overflow-hidden">-
    <div className="flex flex-col h-screen w-full relative overflow-hidden bg-black">
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        // TODO use if the "over" is needed in the DragOverlay, while dragging a comp
        // onDragMove={(e) => console.log(e)}
        sensors={sensors}
        modifiers={[snapToGridModifier]}
        layoutMeasuring={{ strategy: MeasuringStrategy.Always }}
      >
        {showGrid && (
          <div
            style={navBarSize}
            className={`grid grid-cols-[repeat(auto-fill,minmax(20px,20px))] grid-rows-[repeat(auto-fill,minmax(20px,20px))] absolute w-full h-screen bg-[linear-gradient(to_right,#306f7a_1px,transparent_1px),linear-gradient(to_bottom,#306f7a_1px,transparent_1px)] bg-[size:20px_20px]`}
          ></div>
        )}
        {/* PARENT COMPONENTS */}
        <div ref={parentComponentsRef}>
          {addedContent
            .filter((component) => component.dnd === "Droppable")
            .map((component) => (
              <Droppable
                id={component.id}
                // className="absolute z-20"
                className={`${component.positionClass} absolute z-20`}
                key={component.id}
                style={{
                  width: component.size.width,
                  height: component.size.height,
                }}
              >
                <div
                  ref={(el) => (componentRefs.current[component.id] = el)}
                  onClick={() => handleSelectComponent(component.id)}
                >
                  <Resizable
                    minHeight={component.size.minHeight}
                    minWidth={component.size.minWidth}
                    style={getResizableStyle(component.position.placement)}
                    enable={getEnabledResizeHandles(component.position.placement)}
                    handleWrapperStyle={{
                      zIndex: 50,
                    }}
                    size={{
                      width: component.size.width,
                      height: component.size.height,
                    }}
                    onResizeStop={(e, direction, ref, d) => {
                      handleUpdateCompSize(component.id, d);
                    }}
                    onResize={(e, direction, ref, d) => {
                      setTempSizeDelta({
                        width: d.width,
                        height: d.height,
                        id: component.id,
                      });
                    }}
                  >
                    {/* <div ref={(el) => (componentRefs.current[component.id] = el)}> */}
                    <DynamicElement
                      element={component}
                      handleInputChange={handleInputChange}
                      handlePositionChange={handlePositionChange}
                      previewMode={previewMode}
                      input={component.input}
                      childElements={addedContent.filter(
                        (items) => items.parentId === component.id
                      )}
                      tempSizeDelta={tempSizeDelta}
                      // TODO handle this prop for any future refs
                      ref={component.tag === "nav bar" ? navBarSizeRef : null}
                      draggableRef={draggableRef}
                    />
                    {/* </div> */}
                  </Resizable>
                </div>
              </Droppable>
            ))}
        </div>
        {/* NON-PARENT COMPONENTS */}
        <div
          className="absolute"
          style={{
            marginTop: `${parentMargin.marginTop || 0}px`,
            marginLeft: `${parentMargin.marginLeft || 0}px`,
            marginRight: `${parentMargin.marginRight || 0}px`,
            marginBottom: `${parentMargin.marginBottom || 0}px`,
            width: `calc(100vw - ${
              (parentMargin.marginLeft || 0) + (parentMargin.marginRight || 0)
            }px)`,
            height: `calc(100vh - ${
              (parentMargin.marginTop || 0) + (parentMargin.marginBottom || 0)
            }px)`,
          }}
        >
          <Droppable
            id={"mainGrid"}
            // className="gap-32 h-full w-screen z-40 fixed right-0 top-0"
            // TODO add/remove fixed?
            className="h-full w-full z-40"
          >
            <SortableContext
              items={addedContent
                .filter((component) => component.parentId === null)
                .map((component) => component.id)}
              strategy={rectSwappingStrategy}
            >
              {addedContent.length === 0 && isLoading && props.edit && (
                <div className="flex flex-col w-full h-full justify-center place-items-center gap-2">
                  {/* TODO replace with a progress bar? */}
                  <Spinner size="lg" className="bg-white" />
                  <p className="text-white font-medium text-lg">Loading content..</p>
                </div>
              )}

              {addedContent
                .filter(
                  (component) =>
                    component.parentId === null && component.dnd !== "Droppable"
                )
                .map((component) => (
                  <div
                    key={component.id}
                    className="z-5 absolute border-2 border-purple-400 border-dashed"
                    // TODO should check for collision before moving
                    style={{
                      transform: `translate3d(${
                        component.position.x + screenSize.deltaX < 0
                          ? 0
                          : component.position.x + screenSize.deltaX
                      }px, ${
                        component.position.y + screenSize.deltaY < 0
                          ? 0
                          : component.position.y + screenSize.deltaY
                      }px, 0)`,
                    }}
                    ref={draggableRef}
                    onClick={() => handleSelectComponent(component.id)}
                  >
                    <>
                      {/* TODO Move the sortable up, so that the collision works better? */}
                      <Sortable
                        id={component.id}
                        position={component.position}
                        screenSize={screenSize}
                        className="flex z-40 absolute "
                        disabled={component.disabled}
                        style={{
                          width: component.size.width,
                          height: component.size.height,
                        }}
                      >
                        <Resizable
                          // style={{
                          //   display: "flex",
                          //   alignItems: "center",
                          //   justifyContent: "center",
                          //   flexDirection: "column",
                          // }}
                          size={{
                            width: component.size.width,
                            height: component.size.height,
                          }}
                          minHeight={component.size.minHeight}
                          minWidth={component.size.minWidth}
                          onResizeStop={(e, direction, ref, d) => {
                            handleUpdateCompSize(component.id, d);
                          }}
                          onResize={(e, direction, ref, d) => {
                            // TODO refactor this so that the drag overlay doesn't show the initial dragging of the element
                            if (!component.disabled) {
                              toggleComponentDraggable(component.id);
                            }
                            setTempSizeDelta({
                              width: d.width,
                              height: d.height,
                              id: component.id,
                            });
                          }}
                        >
                          <DynamicElement
                            tag={component.tag}
                            id={component.id}
                            element={component}
                            gridId={component.gridId}
                            handleInputChange={handleInputChange}
                            previewMode={previewMode}
                            input={component.input}
                          />
                          <p className="text-white">x: {component.position.x}</p>
                          <p className="text-white">y: {component.position.y}</p>
                          <p className="text-white">id: {component.id}</p>
                        </Resizable>
                      </Sortable>
                    </>
                  </div>
                ))}
            </SortableContext>
            <DragOverlay
              className="outline outline-green-300"
              dropAnimation={{
                duration: 300,
                // easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
              }}
            >
              {addedContent
                .filter((item) => item?.id === draggingComponentId && !item.disabled)
                .map((item) => (
                  <div
                    key={item.id}
                    // className="w-full h-screen"
                    className={`${item.positionClass} `}
                    // style={{
                    //   width: item.size.width,
                    //   height: item.size.height,
                    // }}
                  >
                    <DynamicElement
                      key={item.id}
                      tag={item.tag}
                      id={item.id}
                      element={item}
                      gridId={item.gridId}
                      handleInputChange={handleInputChange}
                      previewMode={previewMode}
                      input={item.input}
                    />
                  </div>
                ))}
            </DragOverlay>
          </Droppable>
        </div>
        <div className="flex flex-col gap-4 w-full h-screen place-items-center justify-end pt-36 pb-4">
          {showSelect && (
            <select
              defaultValue="default"
              className="py-4 px-24 text-black text-lg mt-6 z-50"
              onChange={(e) => handleSubmit(e.target.value)}
            >
              <option value="default" disabled hidden>
                Select an element
              </option>
              {elements?.map((item, index) => (
                <option key={index} value={item.componentId}>
                  {item.placeholder}
                </option>
              ))}
            </select>
          )}

          <FloatingToolbar
            handlePositionChange={handlePositionChange}
            handlePreviewMode={handlePreviewMode}
            handleGridMode={handleGridMode}
            handleSelect={handleSelect}
            shouldCreateOrUpdate={shouldCreateOrUpdate}
            editorProps={props ? props : null}
            toggleComponentDraggable={toggleComponentDraggable}
            selectedComponent={selectedComponent}
          />
        </div>
      </DndContext>
    </div>
  );
}
