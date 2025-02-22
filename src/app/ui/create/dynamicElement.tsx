"use client";
import { useState } from "react";

export function DynamicElement({ tag, className, previewMode }: string) {
  const [textAreaInput, setTextAreaInput] = useState<string>("");

  if (tag == "textarea" && previewMode) {
    return <p>{textAreaInput.length > 0 ? textAreaInput : "No text"}</p>;
  }

  if (tag == "textarea") {
    return (
      <>
        <textarea
          placeholder="Enter your text here.."
          className={className}
          // TODO create a handle function and add slight debounce
          onChange={(e) => setTextAreaInput(e.target.value)}
          value={textAreaInput}
        ></textarea>
      </>
    );
  }
  if (tag == "nav bar") {
    return (
      <div className="flex flex-col h-screen w-28 justify-center content-between place-items-center relative z-10 bg-slate-500 py-8 px-52">
        <p className="text-center text-nowrap text-2xl">Logo</p>
        <p>About me: adfafasfafda</p>
      </div>
    );
  }
}
