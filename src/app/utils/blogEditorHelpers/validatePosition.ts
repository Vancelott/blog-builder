import { IValidatePosition } from "@/app/types/index";

export const validatePosition: IValidatePosition = (
  delta,
  draggedComponent,
  screenSize,
  parentMargin,
  isParentComponent,
) => {
  const { marginTop, marginBottom, marginLeft, marginRight } = parentMargin;

  if (
    delta.x + draggedComponent.position.x + draggedComponent.size.width * 0.9 >
      screenSize.width - (marginLeft + marginRight) ||
    delta.y + draggedComponent.position.y + draggedComponent.size.height * 0.9 >
      screenSize.height - (marginTop + marginBottom)
  ) {
    // TODO issue is here once again
    console.log("Position invalid in `validatePosition`");
    return false;
  }

  // if (
  //   !isParentComponent &&
  //   (delta.x + draggedComponent.position.x < 0 ||
  //     delta.y + draggedComponent.position.y < 0)
  // ) {
  //   console.log("Position invalid in `validatePosition` 2");
  //   return false;
  // }

  return true;
};
