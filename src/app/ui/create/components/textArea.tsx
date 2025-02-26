"use client";

export function TextArea({ isDropped }) {
  return (
    <>
      <div>
        <textarea
          className={`${isDropped ? "hidden" : ""}`}
          placeholder="Enter your text here.."
        ></textarea>
      </div>
    </>
  );
}
