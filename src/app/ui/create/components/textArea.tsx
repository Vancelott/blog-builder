"use client";

export function TextArea({ isDropped, handleInputChange, id, style }) {
  return (
    <>
      <div
      // style={style}
      >
        <textarea
          //  TODO Add debounce
          onChange={(e) => handleInputChange(id, e.target.value)}
          className={`${isDropped ? "hidden" : ""}`}
          placeholder="Enter your text here.."
        />
      </div>
    </>
  );
}
