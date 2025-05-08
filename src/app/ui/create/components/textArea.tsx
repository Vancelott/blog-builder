"use client";

export function TextArea({
  isDropped,
  handleInputChange,
  id,
  position,
  screenSize,
  shouldAdjustPosition,
}) {
  // const { position, screenSize } = style;
  console.log("position", position);
  console.log("position.x + screenSize?.deltaX", position?.x + screenSize?.deltaX);
  // if (shouldAdjustPosition) {
  //   return (
  //     <div>
  //       <textarea
  //         style={{
  //           transform: `translate3d(${
  //             // position.x + screenSize?.deltaX < 0 || position.x < screenSize.width
  //             position.x + screenSize?.deltaX < 0 ? 0 : position.x + screenSize?.deltaX
  //           }px, ${
  //             position.y + screenSize?.deltaY < 0 ? 0 : position.y + screenSize?.deltaY
  //           }px, 0)`,
  //         }}
  //       />
  //     </div>
  //   );
  // }

  return (
    <div>
      <textarea
        //  TODO Add debounce
        onChange={(e) => handleInputChange(id, e.target.value)}
        className={`${isDropped ? "hidden" : ""}`}
        placeholder="Enter your text here.."
      />
    </div>
  );
}
