"use client";

import { DynamicElement } from "@/app/ui/create/dynamicElement";
import { useState, useEffect } from "react";
import { IElement } from "@/app/types/index";
import { createPage } from "@/app/lib/data";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Draggable } from "@/app/ui/create/draggable";
import { Droppable } from "@/app/ui/create/droppable";

const styles: Array = [
  { type: "basic", tag: "textarea", className: "bg-red-400" },
];

const elements: Array<IElement> = [
  {
    id: 0,
    elementId: 0,
    tag: "textarea",
    style: "basic",
    input: "",
    placeholder: "Text Area",
    dnd: "Draggable",
    parentId: null,
    isDropped: false,
  },
  {
    id: 0,
    elementId: 1,
    tag: "nav bar",
    style: "basic",
    input: "",
    placeholder: "Side Navigation Bar",
    dnd: "Droppable",
    otherElements: [],
    parentId: null,
  },
];

export default function Page() {
  // TODO add default content / create a new state variable for the default content
  const [addedContent, setAddedContent] = useState<IElement[]>([]);
  const [showSelect, setShowSelect] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [isDropped, setIsDropped] = useState(false);

  const handleSubmit = (elementId: number) => {
    let elementToBeAdded: Element;
    elements.map((item) => {
      if (item.elementId == elementId) {
        elementToBeAdded = { ...item };
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

  function handleDragEnd(event: DragEndEvent) {
    if (event.over) {
      setIsDropped(true);
    }
    const { active, over } = event;

    const elementId = active.id as string;
    const newStatus = over.id as IElement["parentId"];

    let elementToBeUpdated;
    addedContent.map((element) => {
      if (element.id === elementId) {
        elementToBeUpdated = element;
        elementToBeUpdated.parentId = newStatus;
        elementToBeUpdated.isDropped = true;
      }
    });
    const filteredArray = addedContent.filter(
      (element) => element.id !== elementId
    );
    setAddedContent([...filteredArray, elementToBeUpdated]);

    setIsDropped(false);
  }

  return (
    <div className="flex flex-col relative">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col gap-4 w-full h-screen place-items-center justify-between pt-36 pb-10">
          <div className="flex flex-col items-center gap-4">
            <p>Create page!</p>
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
                className="py-4 px-24 text-black text-lg mt-6"
                onChange={(e) => handleSubmit(e.target.value)}
              >
                <option value="default" disabled hidden>
                  Select an element
                </option>
                {elements?.map((item, index) => (
                  <option key={index} value={item.elementId}>
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
                className="py-6 px-32 font-bold border-2 border-dashed border-orange-400 rounded-lg z-100"
              >
                Add
              </button>
            )}
            {!previewMode && (
              <button
                onClick={() => {
                  createPage({ addedContent });
                }}
                className="py-6 px-32 font-bold border-2 border-dashed border-green-500 rounded-lg z-100"
              >
                Submit
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-x-4 absolute">
          {addedContent.map((item, index) => (
            <div
              // key={index}
              key={item.id}
              className={`flex flex-col justify-center`}
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
                  <p>{item.id}</p>
                  <p>{item.isDropped ? "Dropped" : "Not dropped"}</p>
                </Draggable>
              ) : (
                <Droppable id={item.id}>
                  <DynamicElement
                    key={item.id}
                    tag={item.tag}
                    previewMode={previewMode}
                    isDropped={isDropped}
                    childElements={addedContent.filter(
                      (items) => items.parentId === item.id
                    )}
                  ></DynamicElement>
                </Droppable>
              )}
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
