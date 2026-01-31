import { IUpdateCompSize } from "@/app/types/index";

export const updateCompSize: IUpdateCompSize = (
  resizingComp,
  isResizingCompColliding,
  compId,
  d,
  calculateDelta,
  setAddedContent
) => {
  let { height: heightDelta, width: widthDelta } = d;
  const collidingComponents = isResizingCompColliding(resizingComp);

  // when the collidingComponents cannot be adjusted any further, this prevents the resizingComp from overlapping them
  if (collidingComponents && collidingComponents.length > 0) {
    collidingComponents.forEach((item) => {
      if (item.id !== compId) {
        const deltaX = Math.max(0, calculateDelta(resizingComp, item, widthDelta, "X"));
        const deltaY = Math.max(0, calculateDelta(resizingComp, item, heightDelta, "Y"));

        // uses the smallest delta, as there's an issue that occurs when resizing a comp from its corner
        if (widthDelta !== 0) {
          widthDelta =
            widthDelta < heightDelta && widthDelta > 0 ? widthDelta - deltaX : 0;
        }
        if (heightDelta !== 0) {
          heightDelta =
            heightDelta < widthDelta && heightDelta > 0 ? heightDelta - deltaY : 0;
        }
      }
    });
  }

  setAddedContent((prev) => {
    const prevComp = prev.byId[compId];
    const prevSize = prevComp.size;

    return {
      ...prev,
      byId: {
        ...prev.byId,
        [compId]: {
          ...prevComp,
          size: {
            ...prevSize,
            height: parseInt(prevSize.height) + parseInt(heightDelta),
            width: parseInt(prevSize.width) + parseInt(widthDelta),
            deltaHeight: parseInt(prevSize.deltaHeight) + parseInt(heightDelta),
            deltaWidth: parseInt(prevSize.deltaWidth) + parseInt(widthDelta),
          },
        },
      },
    };
  });
};
