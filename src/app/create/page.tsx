"use client";

import { DynamicElement } from "@/app/ui/create/dynamicElement";
import { useState, useCallback } from "react";
import { IElement } from "@/app/types/index";
import { createPage } from "@/app/lib/data";
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
import { Draggable } from "@/app/ui/create/draggable";
import { Droppable } from "@/app/ui/create/droppable";
import { Sortable } from "@/app/ui/create/sortable";
import { useRef, useEffect, useMemo } from "react";
import {
  SortableContext,
  rectSwappingStrategy,
  rectSortingStrategy,
  arrayMove,
  arraySwap,
} from "@dnd-kit/sortable";
import { elements, styles } from "@/app/utils/constants";
import { Resizable, ResizeCallback } from "re-resizable";
import { MeasuringStrategy } from "@dnd-kit/core";

export default function Page() {
  // TODO add default content / create a new state variable for the default content (if you think there should be such)
  const [addedContent, setAddedContent] = useState<IElement[]>([]);
  const [showSelect, setShowSelect] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [draggingComponentId, setDraggingComponentId] = useState<number>(null);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [navBarSize, setNavBarSize] = useState({});
  const [posState, setPosState] = useState<string>();
  const [screenSize, setScreenSize] = useState({
    width: window?.innerWidth,
    height: window?.innerHeight,
    initialWidth: window?.innerWidth,
    initialHeight: window?.innerHeight,
    deltaX: 0,
    deltaY: 0,
  });
  const [tempSizeDelta, setTempSizeDelta] = useState({ width: 0, height: 0, id: null });
  const [parentMargin, setParentMargin] = useState({});

  const navBarSizeRef = useRef<HTMLDivElement>(null);
  const parentComponentsRef = useRef(null);
  const draggableRef = useRef<HTMLDivElement>(null);
  const componentRefs = useRef<Map<string, HTMLDivElement>>({});

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
    updateParentMargin();
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
    await updateParentMargin();
  };

  const handleSubmit = async (elementId: number) => {
    let elementToBeAdded: Element;
    elements.map((item) => {
      if (item.componentId == elementId) {
        elementToBeAdded = {
          ...item,
        };
        elementToBeAdded.id = addedContent.length;
      }
    });
    setAddedContent((prevContent) => [...prevContent, elementToBeAdded]);

    if (elementToBeAdded.tag === "nav bar") {
      await handlePositionChange("Left"); // default value
    }

    await updateParentMargin();
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
    setDraggingComponentId(event.active.id);
  };

  const handleDragCancel = () => {
    setDraggingComponentId(null);
    return;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { activatorEvent, active, collisions, delta, over } = event;

    if (active === null || over === null) {
      // TODO handle this with an actual error
      console.log("null");
      return;
    }
    const elementId = active.id as string;
    const newStatus = over.id as string | number;
    const draggedComponent = addedContent.find((item) => item.id === elementId);
    const isParentComponent = addedContent.find(
      (component) => component.id == newStatus && component.dnd == "Droppable"
    );
    const { marginTop, marginBottom, marginLeft, marginRight } = parentMargin;

    if (
      delta.x + draggedComponent.position.x + draggedComponent.size.width * 0.9 >
        screenSize.width - (marginLeft + marginRight) ||
      delta.y + draggedComponent.position.y + draggedComponent.size.height * 0.9 >
        screenSize.height - (marginTop + marginBottom)
    ) {
      console.log("Outside of parent element");
      return;
    }

    if (
      !isParentComponent &&
      (delta.x + draggedComponent.position.x < 0 ||
        delta.y + draggedComponent.position.y < 0)
    ) {
      console.log("Outside of parent element");
      return;
    }

    // handles the swapping of components (if elementId == newStatus, it just means the component has been moved, and not swapped)
    if (collisions.length >= 2 && elementId !== newStatus && !isNaN(newStatus)) {
      const swappedComponent = addedContent.find((item) => item.id === over.id);

      setAddedContent((prevAddedContent) => {
        const updatedContent = prevAddedContent.map((component) => {
          if (component.id === draggedComponent.id) {
            return {
              ...component,
              position: swappedComponent.position,
            };
          } else if (component.id === swappedComponent.id) {
            return {
              ...component,
              position: draggedComponent.position,
            };
          }
          return component;
        });

        return arraySwap(updatedContent, draggedComponent.id, swappedComponent.id);
      });
    } else {
      setAddedContent((prevAddedContent) => {
        return prevAddedContent.map((component) => {
          if (component.id === elementId) {
            if (isNaN(newStatus)) {
              return {
                ...component,
                gridId: newStatus,
                parentId: null,
                isDropped: true,
                position: {
                  x: component.position.x + delta.x,
                  y: component.position.y + delta.y,
                },
              };
            } else {
              // used to prevent an accidental update of parentId to a swappable component
              const droppedComponent = prevAddedContent.find(
                (component) => component.id === newStatus
              );
              return {
                ...component,
                gridId: null,
                parentId: droppedComponent.dnd === "Droppable" ? newStatus : null,
                isDropped: true,
                position: {
                  x: component.position.x + delta.x,
                  y: component.position.y + delta.y,
                },
              };
            }
          }

          if (component.id === newStatus) {
            const updatedElement = prevAddedContent.find((item) => item.id === elementId);
            return {
              ...component,
              otherElements: [...component.otherElements, updatedElement],
            };
          }

          return component;
        });
      });
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

  const updateCompDraggable = (id: number, value: boolean) => {
    setAddedContent((prevAddedContent) => {
      return prevAddedContent.map((component) => {
        if (component.id === id) {
          return {
            ...component,
            disabled: value,
          };
        }
        return component;
      });
    });
  };

  // TODO combine all helper functions into one?
  const getResizableStyle = (componentPosition: string) => {
    const additionalStyling = { position: "fixed", border: "1px dashed #ccc" };

    const styles = {
      // TODO fix - additionalStyling doesn't work this way
      Right: { right: 0, top: 0, bottom: 0, position: "fixed", additionalStyling },
      Left: { left: 0, top: 0, bottom: 0, position: "fixed", additionalStyling },
      Bottom: { left: 0, right: 0, bottom: 0, position: "fixed", additionalStyling },
      Top: { left: 0, right: 0, top: 0, position: "fixed", additionalStyling },
    };

    return styles[componentPosition];
  };

  const getEnabledHandles = (componentPosition: string) => {
    const handles = {
      Right: { left: true },
      Left: { right: true },
      Bottom: { top: true },
      Top: { bottom: true },
    };

    return handles[componentPosition];
  };

  const updateParentMargin = () => {
    setParentMargin({});

    const marginsToApply = {
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
    };

    const spaceForHandles = 1;

    Object.entries(componentRefs.current).forEach(([id, element]) => {
      if (element.firstChild.offsetLeft <= 0 && element.firstChild.offsetTop <= 0) {
        if (element.firstChild.offsetWidth < element.firstChild.offsetHeight) {
          marginsToApply["marginLeft"] +=
            element.firstChild.offsetWidth + spaceForHandles;
        } else {
          marginsToApply["marginTop"] +=
            element.firstChild.offsetHeight + spaceForHandles;
        }
      } else {
        if (element.firstChild.offsetWidth < element.firstChild.offsetHeight) {
          // TODO the main grid needs right-0 top-0 (or bottom-0 depends) for these to work
          marginsToApply["marginRight"] +=
            element.firstChild.offsetWidth + spaceForHandles;
        } else {
          marginsToApply["marginBottom"] +=
            element.firstChild.offsetHeight + spaceForHandles;
        }
      }
    });
    setParentMargin(marginsToApply);
  };

  const calculateDelta = (
    resizingComp: IElement,
    collidingComp: IElement,
    resizingCompDelta: number,
    pos: string
  ) => {
    if (pos == "X") {
      return Math.max(
        0,
        Math.min(
          resizingComp.position.x + resizingComp.size.width + resizingCompDelta,
          collidingComp.position.x + collidingComp.size.width
        ) - Math.max(resizingComp.position.x, collidingComp.position.x)
      );
    } else {
      return Math.max(
        0,
        Math.min(
          resizingComp.position.y + resizingComp.size.height + resizingCompDelta,
          collidingComp.position.y + collidingComp.size.height
        ) - Math.max(resizingComp.position.y, collidingComp.position.y)
      );
    }
  };

  const updateCompSize = (id: number, d: ResizeCallback.delta) => {
    let { height: heightDelta, width: widthDelta } = d;
    const resizingComp = findResizingComponent();
    const collidingComponents = isResizingCompColliding(resizingComp);

    // when the collidingComponents cannot be adjusted any further, this prevents the resizingComp from overlapping them
    if (collidingComponents && collidingComponents.length > 0) {
      collidingComponents.forEach((item) => {
        if (item.id !== id) {
          const deltaX = Math.max(0, calculateDelta(resizingComp, item, widthDelta, "X"));
          const deltaY = Math.max(
            0,
            calculateDelta(resizingComp, item, heightDelta, "Y")
          );

          // uses the smallest delta, as there's an issue that occurs when resizing a comp from its corner
          if (widthDelta !== 0) {
            widthDelta =
              widthDelta < heightDelta && widthDelta > 0 ? widthDelta - deltaX : 0;
          }
          if (heightDelta !== 0) {
            heightDelta =
              heightDelta < widthDelta && heightDelta > 0 ? heightDelta - deltaY : 0;
          }
        }
      });
    }

    setAddedContent((prevAddedContent) => {
      return prevAddedContent.map((component) => {
        if (component.id === id) {
          return {
            ...component,
            size: {
              ...component.size,
              height: component.size.height + heightDelta,
              width: component.size.width + widthDelta,
              deltaHeight: component.size.deltaHeight + heightDelta,
              deltaWidth: component.size.deltaWidth + widthDelta,
            },
          };
        }
        return component;
      });
    });
    setTempSizeDelta({ height: 0, width: 0, id: null });
    updateParentMargin();
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
    <div className="flex flex-col h-screen w-full relative overflow-hidden">
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
              >
                <div ref={(el) => (componentRefs.current[component.id] = el)}>
                  <Resizable
                    minHeight={component.size.minHeight}
                    minWidth={component.size.minWidth}
                    style={getResizableStyle(component.position.placement)}
                    enable={getEnabledHandles(component.position.placement)}
                    handleWrapperStyle={{
                      zIndex: 50,
                    }}
                    size={{
                      width: component.size.width,
                      height: component.size.height,
                    }}
                    onResizeStop={(e, direction, ref, d) => {
                      updateCompSize(component.id, d);
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
              {addedContent
                .filter((component) => component.parentId === null)
                .map((component) => (
                  <div
                    key={component.id}
                    className="z-5 absolute border-2 border-purple-500"
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
                  >
                    <button
                      className="p-1 bg-red-900 z-10"
                      onClick={() =>
                        updateCompDraggable(component.id, !component.disabled)
                      }
                    >
                      Disable
                    </button>

                    {component.dnd !== "Droppable" ? (
                      <>
                        {/* TODO Move the sortable up, so that the collision works better? */}
                        <Sortable
                          id={component.id}
                          position={component.position}
                          screenSize={screenSize}
                          className="flex z-40 absolute "
                          disabled={component.disabled}
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
                            onResizeStop={(e, direction, ref, d) => {
                              updateCompSize(component.id, d);
                            }}
                            onResize={(e, direction, ref, d) => {
                              setTempSizeDelta({
                                width: d.width,
                                height: d.height,
                                id: component.id,
                              });
                            }}
                            className="outline-4 outline-purple-300"
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
                            <p>x: {component.position.x}</p>
                            <p>y: {component.position.y}</p>
                            <p>id: {component.id}</p>
                          </Resizable>
                        </Sortable>
                      </>
                    ) : null}
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
                .filter(
                  (item) => item?.id === draggingComponentId && !item.disabled
                  // item.id !== itemBeingResized
                )
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
          <div className="flex flex-col items-center gap-4">
            <button
              // TODO make a handle function with a pop up if there are no added elements
              onClick={() => setPreviewMode(!previewMode)}
              className="p-1 bg-orange-300 rounded-2xl text-black z-50"
            >
              {!previewMode ? "Preview Mode" : "Editing Mode"}
            </button>
            <button
              onClick={() => setShowGrid(!showGrid)}
              className="p-1 bg-blue-300 rounded-2xl text-black z-50"
            >
              {!showGrid ? "Show Grid" : "Hide Grid"}
            </button>
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
          </div>
          <div className="flex flex-col gap-3">
            {!previewMode && (
              <button
                onClick={() => {
                  setShowSelect(true);
                }}
                className="py-6 px-32 font-bold border-2 border-dashed border-orange-400 rounded-lg z-50"
              >
                Add
              </button>
            )}
            {!previewMode && (
              <button
                onClick={() => {
                  createPage(addedContent);
                }}
                className="py-6 px-32 font-bold border-2 border-dashed border-green-500 rounded-lg z-50"
              >
                Create
              </button>
            )}
          </div>
        </div>
      </DndContext>
    </div>
  );
}
