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
// import { DraggableDroppable } from "@/app/ui/create/draggableDroppable";
import { useRef, useEffect } from "react";
import {
  SortableContext,
  rectSwappingStrategy,
  rectSortingStrategy,
  arrayMove,
  arraySwap,
} from "@dnd-kit/sortable";

const styles: Array = [
  {
    type: "basic",
    tag: "textarea",
    className: "bg-red-400",
  },
];

const elements: Array<IElement> = [
  {
    id: 0,
    componentId: 0,
    tag: "textarea",
    style: "basic",
    input: "",
    placeholder: "Text Area",
    dnd: "Draggable",
    isDropped: false,
    parentId: null,
    gridId: null,
    position: { x: 0, y: 0 },
  },
  {
    id: 0,
    componentId: 1,
    tag: "nav bar",
    style: "basic",
    input: "",
    placeholder: "Side Navigation Bar",
    dnd: "Droppable",
    otherElements: [],
    isDropped: false,
    parentId: null,
    gridId: null,
    position: { x: 0, y: 0 },
  },
];

export default function Page() {
  // TODO add default content / create a new state variable for the default content
  const [addedContent, setAddedContent] = useState<IElement[]>([]);
  const [showSelect, setShowSelect] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [isDropped, setIsDropped] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [draggingComponentId, setDraggingComponentId] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [positionStyle, setPositionStyle] = useState("");
  const [navBarSize, setNavBarSize] = useState({});
  const [posState, setPosState] = useState("");
  const [screenSize, setScreenSize] = useState({
    width: window?.innerWidth,
    height: window?.innerHeight,
    initialWidth: window?.innerWidth,
    initialHeight: window?.innerHeight,
    deltaX: 0,
    deltaY: 0,
  });

  const navBarSizeRef = useRef(null);
  const draggableRef = useRef(null);

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
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

  useEffect(() => {
    if (posState == "Right") {
      setNavBarSize({ marginRight: navBarSizeRef.current.offsetWidth + "px", right: 0 });
    } else if (posState == "Bottom") {
      setNavBarSize({
        marginBottom: navBarSizeRef.current.offsetHeight + "px",
        bottom: 0,
      });
    } else if (posState == "Top") {
      setNavBarSize({ marginTop: navBarSizeRef.current.offsetHeight + "px" });
    } else if (posState == "Left") {
      setNavBarSize({ marginLeft: navBarSizeRef.current.offsetWidth + "px" });
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

    console.log("screenSize", screenSize);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [screenSize]);

  const handlePositionChange = (pos: string) => {
    setNavBarSize(null);
    setPositionStyle(null);
    setPosState(pos);

    if (pos == "Right") {
      setPositionStyle("inset-y-0 right-0 w-80 h-screen place-items-center");
    } else if (pos == "Bottom") {
      setPositionStyle("inset-x-0 bottom-0 h-28 w-screen place-items-start px-8");
    } else if (pos == "Top") {
      setPositionStyle("inset-x-0 top-0 h-28 w-screen place-items-start px-8");
    } else if (pos == "Left") {
      setPositionStyle("inset-y-0 left-0 w-80 h-screen place-items-center");
    }
  };

  const handleSubmit = (elementId: number) => {
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
      handlePositionChange("Left"); // default value
    }

    console.log(addedContent);
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
    // setActiveId(event.active.id);

    // const item = addedContent.find((item) => item.id == activeId);

    setDraggingComponentId(event.active.id);
    // setDraggingParent(false);

    // if id is of a parent component, make the grid a specific size with a conditional classname
  };

  const handleDragCancel = () => {
    setDraggingParent(false);
    setActiveId(null);
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

    // const navBarWidth =
    //   navBarSizeRef?.current?.offsetWidth > navBarSizeRef?.current?.offsetHeight
    //     ? navBarSizeRef?.current?.offsetWidth
    //     : 0;
    // const navBarHeight =
    //   navBarSizeRef?.current?.offsetHeight > navBarSizeRef?.current?.offsetWidth
    //     ? navBarSizeRef?.current?.offsetHeight
    //     : 0;

    // if (
    //   elementId === newStatus &&
    //   (delta.x +
    //     draggedComponent.position.x +
    //     draggableRef.current.offsetWidth * 0.98 +
    //     navBarWidth >
    //     window.innerWidth ||
    //     delta.y +
    //       draggedComponent.position.y +
    //       draggableRef.current.offsetHeight * 0.98 +
    //       navBarHeight >
    //       window.innerHeight)
    // ) {
    //   console.log("Outside of parent element");
    //   return;
    // }

    // if (
    //   elementId !== newStatus &&
    //   // // kind of works, but not at 100% (dropping on the right edge doesn't work properly)
    //   // delta.x + draggedComponent.position.x > over.rect.width * 0.95 ||
    //   // delta.y + draggedComponent.position.y > over.rect.height * 0.9
    //   (delta.x + draggedComponent.position.x + draggableRef.current.offsetWidth * 0.98 >
    //     over.rect.width ||
    //     delta.y + draggedComponent.position.y + draggableRef.current.offsetHeight * 0.98 >
    //       over.rect.height)
    // ) {
    //   // TODO instead of returning, should the component be placed at the max value of whichever axis overflowed?
    //   console.log("Outside of parent element");
    //   return;
    // }

    // // TODO should the user be allowed to place components just outside of the window's width/height?
    // if (
    //   (newStatus === undefined && delta.x + draggedComponent.position.x < 0) ||
    //   delta.y + draggedComponent.position.y < 0
    // ) {
    //   return;
    // }

    // handles the swapping of components (if elementId == newStatus, it just means the component has been moved, and not swapped)
    if (collisions.length >= 2 && elementId !== newStatus && !isNaN(newStatus)) {
      const swappedComponent = addedContent.find((item) => item.id === over.id);

      setAddedContent((prevAddedContent) => {
        return prevAddedContent.map((component) => {
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
        });
        return arraySwap(component, draggedComponent.id, swappedComponent.id);
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
                  // x:
                  //   (((component.position.x / 100) * screenSize.width + delta.x) /
                  //     screenSize.width) *
                  //   100,
                  // y:
                  //   (((component.position.y / 100) * screenSize.height + delta.y) /
                  //     screenSize.height) *
                  //   100,
                },
              };
            } else {
              return {
                ...component,
                gridId: null,
                parentId: newStatus,
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

          console.log("component", component);
          console.log("addedContent", addedContent);
          return component;
        });
      });
    }

    setIsDropped(false);
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

  const gridSize = 20; // pixels
  const snapToGridModifier = createSnapModifier(gridSize);

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
        {/* <div className={`h-screen w-[${navBarSizeRef?.current?.offsetWidth}px]`}> */}
        {/* PARENT COMPONENTS */}
        <div
          // style={{
          //   height: "100%",
          //   minWidth: "fit-content",
          //   maxWidth: "320px",
          //   width: "100%",
          // }}
          // className={`h-screen w-full max-w-[320px]`}
          className="flex flex-col w-full h-screen absolute justify-center"
        >
          {addedContent
            .filter((component) => component.dnd === "Droppable")
            .map((component) => (
              <Droppable
                id={component.id}
                className="z-20 w-full h-full"
                key={component.id}
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
                  ref={component.tag === "nav bar" ? navBarSizeRef : null}
                  positionStyle={component.tag === "nav bar" ? positionStyle : null}
                />
              </Droppable>
            ))}
        </div>
        {/* NON-PARENT COMPONENTS */}
        <div className="h-screen w-full">
          {/* TODO add the dynamic style from the navbar */}
          <Droppable
            id={"mainGrid"}
            className="gap-32 h-screen w-full z-20 absolute"
            style={navBarSize}
          >
            <SortableContext
              items={addedContent
                .filter((component) => component.parentId === null)
                .map((component) => component)}
              strategy={rectSwappingStrategy}
            >
              {/* <Droppable id={gridItem.gridId} key={index} className="w-full h-full"> */}
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
                        {/* <PositionButtons handlePositionChange={handlePositionChange} /> */}
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
                  <div key={item.id}>
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
        <div className="flex flex-col gap-4 w-full h-screen place-items-center justify-end pt-36 pb-4 relative">
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
