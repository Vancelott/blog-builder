import { ICalculateDelta } from "@/app/types/index";

export const calculateDelta: ICalculateDelta = (
  resizingComp,
  collidingComp,
  resizingCompDelta,
  pos
) => {
  if (pos == "X") {
    return Math.max(
      0,
      Math.min(
        resizingComp.position.x + resizingComp.size.width + resizingCompDelta,
        collidingComp.position.x + collidingComp.size.width
      ) - Math.max(resizingComp.position.x, collidingComp.position.x)
    );
  } else {
    return Math.max(
      0,
      Math.min(
        resizingComp.position.y + resizingComp.size.height + resizingCompDelta,
        collidingComp.position.y + collidingComp.size.height
      ) - Math.max(resizingComp.position.y, collidingComp.position.y)
    );
  }
};
