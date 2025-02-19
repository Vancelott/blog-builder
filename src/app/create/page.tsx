"use client";

import { DynamicElement } from "@/app/ui/create/dynamicElement";
// import { TextArea } from "@/app/ui/create/textArea";
import { useState } from "react";

interface Element {
  id: number;
  elementId: number;
  tag: string;
  style: string;
  input: string;
  placeholder: string;
}

const styles: Array = [
  { type: "basic", tag: "textarea", className: "bg-red-400" },
];

const elements: Array<Element> = [
  {
    id: 0,
    elementId: 0,
    tag: "textarea",
    style: "basic",
    input: "",
    placeholder: "Text Area",
  },
];

export default function Page() {
  const [addedContent, setAddedContent] = useState<Element[]>([]);
  const [showSelect, setShowSelect] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  const handleSubmit = (elementId: string) => {
    const elementToBeAdded = elements.find(
      (item) => item.elementId == elementId
    );
    elementToBeAdded.id = addedContent.length;
    setAddedContent((prevContent) => [...prevContent, elementToBeAdded]);
    setShowSelect(false);
  };

  const handleDelete = (elementToDelete: Element) => {
    const updatedContent = addedContent.filter(
      (element) => element.id !== elementToDelete.id
    );
    setAddedContent(updatedContent);
  };

  return (
    <div className="flex flex-col gap-4 w-full h-screen place-items-center py-36">
      <div className="text-center">
        <p>Create page!</p>
        <p>{addedContent.length}</p>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="p-1 bg-orange-300 rounded-2xl text-black"
        >
          Preview
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {addedContent.map((item, index) => (
          <div
            key={index}
            className="flex gap-x-2 justify-center place-items-center"
          >
            <DynamicElement tag={item.tag} previewMode={previewMode} />
            <button
              onClick={() => handleDelete(item)}
              className="px-2 py-1 bg-red-800 text-white"
            >
              X
            </button>
          </div>
        ))}
      </div>
      {showSelect && (
        <select
          defaultValue="2"
          className="py-4 px-24 text-black text-lg mt-6"
          onChange={(e) => handleSubmit(e.target.value)}
        >
          {elements?.map((item, index) => (
            <option key={index} value={item.elementId}>
              {item.placeholder}
            </option>
          ))}
          <option value="2">Select an element</option>
        </select>
      )}
      <button
        onClick={() => {
          setShowSelect(true);
        }}
        className="py-6 px-64 mt-6 font-bold border-2 border-dashed border-orange-400 rounded-lg"
      >
        Add
      </button>
    </div>
  );
}
