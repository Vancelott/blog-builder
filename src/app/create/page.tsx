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
  useSensor,
} from "@dnd-kit/core";
import { Draggable } from "@/app/ui/create/draggable";
import { Droppable } from "@/app/ui/create/droppable";
import { DraggableDroppable } from "@/app/ui/create/draggableDroppable";
import { PositionButtons } from "@/app/ui/create/components/positionButtons";

// import { SortableItem } from "@/app/ui/create/sortableItem";
// import { SortableContext } from "@dnd-kit/sortable";

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
  },
];

// const handler = ({ nativeEvent: event }: MouseEvent | TouchEvent) => {
//   let cur = event.target as HTMLElement;

//   while (cur) {
//     if (cur.dataset && cur.dataset.noDnd) {
//       return false;
//     }
//     cur = cur.parentElement as HTMLElement;
//   }

//   return true;
// };

// export class MouseSensor extends LibMouseSensor {
//   static activators = [
//     { eventName: "onMouseDown", handler },
//   ] as (typeof LibMouseSensor)["activators"];
// }

export default function Page() {
  // TODO add default content / create a new state variable for the default content
  const [addedContent, setAddedContent] = useState<IElement[]>([]);
  const [showSelect, setShowSelect] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [isDropped, setIsDropped] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [draggingParent, setDraggingParent] = useState(false);
  const [positionChange, setPositionChange] = useState("");

  const handlePositionChange = (pos) => {
    console.log("pos", pos);
    setPositionChange(pos);
  };

  // const sensors = useSensors(MouseSensor);

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
    setActiveId(event.active.id);

    addedContent.find((item) => item.id == activeId);

    setDraggingParent(true);
    // setDraggingParent(false);

    // if id is of a parent component, make the grid a specific size with a conditional classname
  };

  const handleDragCancel = () => {
    setDraggingParent(false);
    setActiveId(null);
    return;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // console.log(event);

    // if (event.disabled) {
    //   console.log("disabled");
    //   return false;
    // }

    if (active === null || over === null) {
      console.log("null");
      return;
    }
    const elementId = active.id as string;
    const newStatus = over.id as string | number;

    const isAllowed = () => {
      const element = elements.find((element) => element.elementId == newStatus);
      const component = addedContent.find((component) => component.id == newStatus);
      if (!element && !component) {
        return false;
      }
      return true;
    };
    console.log("isAllowed", isAllowed());

    if (!isAllowed) {
      console.log("isAllowed", isAllowed);
      return false;
    }

    // let elementToBeUpdated;
    // let elementToBeUpdated2;
    // if (active.id !== over.id) {
    //   addedContent.map((element) => {
    //     if (element.id === elementId) {
    //       elementToBeUpdated = element;
    //       if (isNaN(newStatus)) {
    //         elementToBeUpdated.gridId = newStatus;
    //       } else {
    //         // assign the droppable's id as the parentId of the draggable component
    //         elementToBeUpdated.parentId = newStatus;
    //         // testing
    //         addedContent.map((parentElement) => {
    //           if (parentElement.id === newStatus) {
    //             console.log("parentElement", parentElement);
    //             elementToBeUpdated2 = parentElement;
    //             elementToBeUpdated2.otherElements.push(elementToBeUpdated);
    //           }
    //         });

    //         // elementToBeUpdated2.otherElements.push(elementToBeUpdated);
    //       }
    //       // addedContent.map((parentElement) => {
    //       //   if (parentElement.id === newStatus) {
    //       //     console.log("parentElement", parentElement);
    //       //     elementToBeUpdated2 = parentElement;
    //       //     elementToBeUpdated2.otherElements.push(elementToBeUpdated);
    //       //   }
    //       // });

    //       elementToBeUpdated.isDropped = true;
    //     }
    //   });

    //   const filteredArray = addedContent.filter((element) => element.id !== elementId);
    //   setAddedContent([...filteredArray, elementToBeUpdated]);
    // }

    setAddedContent((prevAddedContent) => {
      return prevAddedContent.map((component) => {
        if (component.id === elementId) {
          if (isNaN(newStatus)) {
            return { ...component, gridId: newStatus, isDropped: true };
          } else {
            return { ...component, parentId: newStatus, isDropped: true };
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

    setIsDropped(false);
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
  ];

  return (
    <div className="flex flex-col relative">
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        collisionDetection={pointerWithin}
        // sensors={sensors}
      >
        {/* <div className="grid grid-cols-3 pl-32 grid-rows-2 h-screen absolute w-full"> */}
        <div className="grid grid-cols-12 pl-32 grid-rows-11 h-screen absolute w-full">
          {Grid.map((gridItem, index) => (
            <Droppable id={gridItem.gridId} key={index} className="w-full h-full">
              {addedContent
                .filter((component) => component.gridId === gridItem.gridId)
                .map((component) => (
                  <div key={component.id} className="z-5">
                    {component.dnd === "Droppable" ? (
                      <>
                        {/* <PositionButtons handlePositionChange={handlePositionChange} /> */}
                        <DraggableDroppable id={component.id}>
                          <DynamicElement
                            tag={component.tag}
                            id={component.id}
                            key={component.id}
                            gridId={gridItem.gridId}
                            childElements={addedContent
                              .filter((items) => items.gridId === gridItem.gridId)
                              .flatMap((item) => item.otherElements || [])}
                          />
                        </DraggableDroppable>
                      </>
                    ) : (
                      <>
                        {/* <PositionButtons handlePositionChange={handlePositionChange} /> */}
                        <Draggable id={component.id}>
                          <DynamicElement
                            tag={component.tag}
                            id={component.id}
                            key={component.id}
                            gridId={gridItem.gridId}
                          />
                        </Draggable>
                      </>
                    )}
                  </div>
                ))}
            </Droppable>
          ))}
        </div>

        {/* wtori working opit  */}
        {/* {Grid.map((gridItem, index) => (
            <Droppable id={gridItem.gridId} key={index} className="w-full h-full">
              <DynamicElement
                tag={
                  addedContent.find((item) => item.gridId === gridItem.gridId)?.tag || ""
                }
                id={
                  addedContent.find((item) => item.gridId === gridItem.gridId)?.id || ""
                }
                key={gridItem.gridId}
                gridId={gridItem.gridId}
                // childElements={addedContent
                //   .filter((items) => items.gridId === gridItem.gridId)
                //   .map((item) => item.otherElements)}
                childElements={addedContent
                  .filter((items) => items.gridId === gridItem.gridId)
                  .flatMap((item) => item.otherElements || [])}
              />
            </Droppable>
          ))}
        </div> */}

        {/* Working opit!!!!!!!!!!!!
          {Grid.map((gridItem, index) => (
            <Droppable id={gridItem.gridId} key={index} className="w-full h-full">
              <DynamicElement
                tag={addedContent.filter((items) => items.gridId === gridItem.gridId).tag}
                key={gridItem.gridId}
                gridId={gridItem.gridId}
                childElements={addedContent.filter(
                  (items) => items.gridId === gridItem.gridId
                )}
              ></DynamicElement>
            </Droppable>
          ))}
        </div> */}
        <div className="flex flex-col gap-4 w-full h-screen place-items-center justify-between pt-36 pb-10">
          <div className="flex flex-col items-center gap-4">
            <button
              // TODO make a handle function with a pop up if there are no added elements
              onClick={() => setPreviewMode(!previewMode)}
              className="p-1 bg-orange-300 rounded-2xl text-black"
            >
              {!previewMode ? "Preview Mode" : "Editing Mode"}
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
                  createPage({
                    addedContent,
                  });
                }}
                className="py-6 px-32 font-bold border-2 border-dashed border-green-500 rounded-lg z-100"
              >
                Submit
              </button>
            )}
          </div>
        </div>
        {/* <div className="flex gap-x-4 absolute w-full justify-center"> */}
        <div className="flex w-full flex-row gap-x-4 absolute">
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
              <div className="flex w-full justify-end place-content-end place-items-end">
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
                    <DraggableDroppable id={item.id} className="flex flex-col relative">
                      <DynamicElement
                        key={item.id}
                        tag={item.tag}
                        style={positionChange}
                        previewMode={previewMode}
                        isDropped={isDropped}
                        childElements={addedContent.filter(
                          (items) => items.parentId === item.id
                        )}
                      ></DynamicElement>
                    </DraggableDroppable>
                    <div className="absolute z-20 mt-8">
                      <PositionButtons handlePositionChange={handlePositionChange} />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
