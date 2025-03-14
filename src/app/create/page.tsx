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
import { createSnapModifier, restrictToParentElement } from "@dnd-kit/modifiers";
import { Draggable } from "@/app/ui/create/draggable";
import { Droppable } from "@/app/ui/create/droppable";
import { DraggableDroppable } from "@/app/ui/create/draggableDroppable";
import { PositionButtons } from "@/app/ui/create/components/positionButtons";
import { useRef } from "react";

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
  const [positionChange, setPositionChange] = useState("");
  const [showGrid, setShowGrid] = useState(false);

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

  const handlePositionChange = (pos) => {
    console.log("pos", pos);
    setPositionChange(pos);
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
    const { active, over, delta } = event;

    console.log("event", event);

    if (active === null || over === null) {
      // TODO handle this with an actual error
      console.log("null");
      return;
    }
    const elementId = active.id as string;
    const newStatus = over.id as string | number;

    setAddedContent((prevAddedContent) => {
      return prevAddedContent.map((component) => {
        if (component.id === elementId) {
          if (isNaN(newStatus)) {
            return {
              ...component,
              gridId: newStatus,
              isDropped: true,
              position: {
                x: delta.x + component.position.x,
                y: delta.y + component.position.y,
              },
            };
          } else {
            return {
              ...component,
              parentId: newStatus,
              isDropped: true,
              position: { left: over.rect.left, right: over.rect.right },
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

    console.log("addedContent", addedContent[0].position);
    console.log("draggableRef", draggableRef);
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

  const Grid = [
    {
      gridId: "gridA",
      name: "A",
    },
    {
      gridId: "gridB",
      name: "B",
    },
    {
      gridId: "gridC",
      name: "C",
    },
    {
      gridId: "gridD",
      name: "D",
    },
    {
      gridId: "gridE",
      name: "E",
    },
    {
      gridId: "gridF",
      name: "F",
    },
    {
      gridId: "gridG",
      name: "G",
    },
    {
      gridId: "gridH",
      name: "H",
    },
    {
      gridId: "gridI",
      name: "I",
    },
    {
      gridId: "gridJ",
      name: "J",
    },
  ];

  const gridSize = 20; // pixels
  const snapToGridModifier = createSnapModifier(gridSize);

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        sensors={sensors}
        modifiers={[snapToGridModifier]}
      >
        {/* TODO ml-32 due to the navbar being droppable, make it dynamic */}
        {showGrid && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(20px,20px))] grid-rows-[repeat(auto-fill,minmax(20px,20px))] absolute w-full h-full ml-32 bg-[linear-gradient(to_right,#306f7a_1px,transparent_1px),linear-gradient(to_bottom,#306f7a_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        )}
        {/* <div className="grid grid-cols-6 pl-32 grid-rows-4 h-screen absolute w-full"> */}
        {/* <div className="grid grid-cols-12 pl-32 grid-rows-11 h-screen absolute w-full"> */}
        {/* {Grid.map((gridItem, index) => ( */}
        <Droppable id={"mainGrid"} className="flex pl-32 h-screen w-full absolute">
          {/* <Droppable id={gridItem.gridId} key={index} className="w-full h-full"> */}
          {addedContent
            .filter((component) => component.gridId !== null)
            .map((component) => (
              <div
                key={component.id}
                className="z-5"
                style={{
                  transform: `translate3d(${component.position.x}px, ${component.position.y}px, 0)`,
                  // translate3d: (component.position.left, component.position.right, 0),
                  // left: `${component.position.left}px`,
                  // right: `${component.position.right}px`,
                }}
                ref={draggableRef}
              >
                {component.dnd === "Droppable" ? (
                  <>
                    {/* <PositionButtons handlePositionChange={handlePositionChange} /> */}
                    <DraggableDroppable id={component.id} className="z-40">
                      <DynamicElement
                        tag={component.tag}
                        id={component.id}
                        element={component}
                        gridId={component.gridId}
                        handleInputChange={handleInputChange}
                        previewMode={previewMode}
                        input={component.input}
                        childElements={addedContent
                          .filter(
                            (items) => items.id === component.id && items.gridId !== null
                          )
                          .flatMap((item) => item.otherElements || [])}
                      />
                    </DraggableDroppable>
                  </>
                ) : (
                  <>
                    {/* <PositionButtons handlePositionChange={handlePositionChange} /> */}
                    <Draggable id={component.id} className="z-40">
                      <DynamicElement
                        tag={component.tag}
                        id={component.id}
                        element={component}
                        gridId={component.gridId}
                        handleInputChange={handleInputChange}
                        previewMode={previewMode}
                        input={component.input}
                      />
                    </Draggable>
                  </>
                )}
              </div>
            ))}
          <DragOverlay>
            {addedContent
              .filter((item) => item?.id === draggingComponentId)
              .map((item) => (
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
              ))}
          </DragOverlay>

          {/* ))} */}
        </Droppable>
        <div className="flex flex-col gap-4 w-full h-screen place-items-center justify-end pt-36 pb-4">
          <div className="flex flex-row items-center gap-4">
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
        <div className="flex gap-x-4 absolute">
          {/* <div className="flex w-full flex-row gap-x-4"> */}
          {addedContent.map((item, index) => (
            <div
              // key={index}
              key={item.id}
              className={`flex flex-col justify-center z-10`}
              // onMouseOver={() => handleShowDelete(!showDelete)}
            >
              {showDelete && (
                <button
                  onClick={() => handleDelete(item)}
                  className="px-2 py-1 bg-red-800 text-white"
                >
                  X
                </button>
              )}
              {item.dnd == "Draggable" ? (
                <Draggable id={item.id}>
                  <DynamicElement
                    tag={item.tag}
                    previewMode={previewMode}
                    isDropped={item.isDropped}
                    // className={`${item.isDropped == true ? "hidden" : ""}`}
                  />
                </Draggable>
              ) : item.gridId === null ? (
                <div className="flex flex-col relative">
                  {/* <DraggableDroppable id={item.id} className="flex flex-col relative"> */}
                  <Droppable id={item.id} className="flex flex-col relative">
                    {/* TODO wrap the child elements in a draggable? Maybe there should be a dynamic element for the parent component, and the childElements are passed in as actual children*/}
                    <DynamicElement
                      key={item.id}
                      tag={item.tag}
                      style={positionChange}
                      previewMode={previewMode}
                      isDropped={isDropped}
                      childElements={addedContent.filter(
                        (items) => items.parentId === item.id
                      )}
                    >
                      <Draggable></Draggable>
                    </DynamicElement>
                  </Droppable>
                  {/* </DraggableDroppable> */}
                  <div className="absolute z-20 mt-8">
                    <PositionButtons handlePositionChange={handlePositionChange} />
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
