import { IValidateSize } from "@/app/types/index";

export const validateSize = (
  d,
  resizingComp,
  isChildComponent,
  parentMargin,
  parentComp,
  screenSize
): IValidateSize => {
  const { marginTop, marginBottom, marginLeft, marginRight } = parentMargin;

  if (!isChildComponent || !parentComp) {
    return false;
  }

  const parentHeight =
    parentSize.height === "100vh"
      ? screenSize.height - (marginTop + marginBottom)
      : parseInt(parentSize.height);

  const parentWidth =
    parentSize.width === "100vh"
      ? screenSize.width - (marginLeft + marginRight)
      : parseInt(parentSize.width);

  if (
    d.height + resizingComp.size.height > parentHeight ||
    d.width + resizingComp.size.width > parentWidth
  ) {
    return false;
  }

  if (
    !isChildComponent &&
    (d.height + resizingComp.size.height < 0 || d.width + resizingComp.size.width < 0)
  ) {
    return false;
  }

  return true;
};
