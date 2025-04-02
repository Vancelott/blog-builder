"use client";

import { DynamicElement } from "@/app/ui/create/dynamicElement";
import { useState } from "react";
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
import { useRef, useEffect } from "react";
import {
  SortableContext,
  rectSwappingStrategy,
  rectSortingStrategy,
  arrayMove,
  arraySwap,
} from "@dnd-kit/sortable";
import { elements, styles } from "@/app/utils/constants";
import { Resizable } from "re-resizable";

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
  const [tempSizeDelta, setTempSizeDelta] = useState({ width: 0, height: 0 });

  const navBarSizeRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<HTMLDivElement>(null);

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

  const handlePositionChange = (pos: string) => {
    if (pos === posState) {
      return;
    }
    setNavBarSize(null);
    setPosState(pos);

    const positionClasses = [
      {
        pos: "Right",
        // className: "inset-y-0 right-0 min-w-80 min-h-screen place-items-center",
        className: "inset-y-0 right-0 w-80 h-screen place-items-center",
      },
      {
        pos: "Bottom",
        className: "inset-x-0 bottom-0 h-28 w-screen place-items-start px-8 mt-20",
      },
      {
        pos: "Top",
        className: "inset-x-0 top-0 h-28 w-screen place-items-start px-8 mt-20",
      },
      {
        pos: "Left",
        // className: "inset-y-0 left-0 min-w-80 min-h-screen place-items-center",
        className: "inset-y-0 left-0 w-80 min-h-screen place-items-center",
      },
    ];

    const { className } = positionClasses.find((item) => item.pos === pos);
    setAddedContent((prevAddedContent) => {
      return prevAddedContent.map((component) => {
        if (component.tag === "nav bar") {
          return { ...component, positionClass: className };
        }
        return component;
      });
    });
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
      // await handlePositionChange("Left"); // default value
      await handlePositionChange("Right");
    }

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

    const navBarWidth =
      navBarSizeRef?.current?.offsetWidth < navBarSizeRef?.current?.offsetHeight
        ? navBarSizeRef?.current?.offsetWidth
        : 0;
    const navBarHeight =
      navBarSizeRef?.current?.offsetHeight < navBarSizeRef?.current?.offsetWidth
        ? navBarSizeRef?.current?.offsetHeight
        : 0;

    if (
      elementId === newStatus &&
      (delta.x +
        draggedComponent.position.x +
        draggableRef.current.offsetWidth * 0.98 +
        navBarWidth >
        window.innerWidth ||
        delta.y +
          draggedComponent.position.y +
          draggableRef.current.offsetHeight * 0.98 +
          navBarHeight >
          window.innerHeight)
    ) {
      console.log("Outside of parent element");
      return;
    }

    const isParentComponent = addedContent.find(
      (component) => component.id == newStatus && component.dnd == "Droppable"
    );

    if (
      elementId !== newStatus &&
      !isParentComponent &&
      (delta.x + draggedComponent.position.x + draggableRef.current.offsetWidth * 0.98 >
        over.rect.width ||
        delta.y + draggedComponent.position.y + draggableRef.current.offsetHeight * 0.98 >
          over.rect.height)
    ) {
      // TODO instead of returning, should the component be placed at the max value of whichever axis overflowed?
      console.log("Outside of parent element");
      return;
    }

    // TODO should the user be allowed to place components just outside of the window's width/height?
    if (
      (newStatus === undefined && delta.x + draggedComponent.position.x < 0) ||
      delta.y + draggedComponent.position.y < 0
    ) {
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

  const updateCompSize = (id, d) => {
    const { height, width } = d;

    setAddedContent((prevAddedContent) => {
      return prevAddedContent.map((component) => {
        if (component.id === id) {
          return {
            ...component,
            size: {
              ...component.size,
              height: component.size.height + height,
              width: component.size.width + width,
            },
          };
        }
        return component;
      });
    });
    console.log("prevAddedContent", addedContent);
    setTempSizeDelta({ height: 0, width: 0 });
  };

  return (
    // TODO remove flex-col?
    // <div className="flex h-screen w-full relative overflow-hidden">-
    <div className="flex flex-col h-screen w-full relative overflow-hidden">
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        sensors={sensors}
        modifiers={[snapToGridModifier]}
      >
        {showGrid && (
          <div
            style={navBarSize}
            className={`grid grid-cols-[repeat(auto-fill,minmax(20px,20px))] grid-rows-[repeat(auto-fill,minmax(20px,20px))] absolute w-full h-screen bg-[linear-gradient(to_right,#306f7a_1px,transparent_1px),linear-gradient(to_bottom,#306f7a_1px,transparent_1px)] bg-[size:20px_20px]`}
          ></div>
        )}
        {/* PARENT COMPONENTS */}
        {addedContent
          .filter((component) => component.dnd === "Droppable")
          .map((component) => (
            <Droppable
              id={component.id}
              // className="absolute z-20"
              className={`${component.positionClass} absolute z-20`}
              key={component.id}
            >
              <Resizable
                minHeight={"100%"}
                minWidth="64px"
                style={{
                  border: "1px dashed #ccc",
                  // TODO consider removing/adding fixed positioning?
                  position: "fixed",
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
                // boundsByDirection={true}
                // lockAspectRatio={true}
                enable={{
                  top: false,
                  right: false,
                  bottom: false,
                  left: true,
                  topRight: false,
                  bottomRight: false,
                  bottomLeft: false,
                  topLeft: false,
                }}
                handleWrapperStyle={{
                  zIndex: 50,
                }}
                size={{
                  // width: navBarSizeRef.current?.offsetWidth + component.size?.width,
                  // height: navBarSizeRef.current?.offsetHeight + component.size?.height,
                  width: navBarSizeRef.current?.offsetWidth,
                  height: navBarSizeRef.current?.offsetHeight,
                }}
                onResizeStop={(e, direction, ref, d) => {
                  updateCompSize(component.id, d);
                }}
                onResize={(e, direction, ref, d) => {
                  console.log("onResized", d);
                  // setTempSizeDelta({
                  //   width: tempSizeDelta.width + d.width,
                  //   height: tempSizeDelta.height + d.height,
                  // });
                  setTempSizeDelta({
                    width: d.width,
                    height: d.height,
                  });
                }}
              >
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
                  ref={component.tag === "nav bar" ? navBarSizeRef : null}
                  positionStyle={component.positionClass}
                  draggableRef={draggableRef}
                />
              </Resizable>
            </Droppable>
          ))}
        {/* NON-PARENT COMPONENTS */}
        <div
        // className="h-screen"
        // style={{ width: `calc(100% - ${navBarSizeRef?.size})` }}
        >
          <Droppable
            id={"mainGrid"}
            // className="gap-32 h-screen w-full z-40 fixed"
            // TODO improve the style so that it can account for other parent components
            // width: `calc(100% - ${navBarSizeRef.current?.offsetWidth}px)`,
            // [navBarSize?.marginDirection]: `${navBarSizeRef.current?.offsetWidth + 2}px`,
            // style={{
            //   width: `calc(100% - ${navBarSize?.size}px)`,
            //   [navBarSize?.marginDirection]: `${navBarSize?.size}px`,
            // }}
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
                    className="z-5 absolute"
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
                    {component.dnd !== "Droppable" ? (
                      <>
                        {/* TODO Move the sortable up, so that the collision works better? */}
                        <Sortable
                          id={component.id}
                          key={component.id}
                          position={component.position}
                          screenSize={screenSize}
                          className="flex z-40 absolute"
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
                        </Sortable>
                      </>
                    ) : null}
                  </div>
                ))}
            </SortableContext>
            <DragOverlay
              className="outline outline-green-300 outline-offset-4"
              dropAnimation={{
                duration: 300,
                // easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
              }}
            >
              {addedContent
                .filter((item) => item?.id === draggingComponentId)
                .map((item) => (
                  <div key={item.id} className="w-full h-screen">
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
