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
  if (tag == "paragraph") {
    return <p>{input}</p>;
  }
}
