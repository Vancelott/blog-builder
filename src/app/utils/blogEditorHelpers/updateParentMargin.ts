import { IUpdateParentMargin } from "@/app/types/index";

export const updateParentMargin: IUpdateParentMargin = (
  setParentMargin,
  componentRefs
) => {
  setParentMargin({});

  const marginsToApply = {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  };

  const spaceForHandles = 1;

  Object.entries(componentRefs.current).forEach(([id, element]) => {
    if (element.firstChild.offsetLeft <= 0 && element.firstChild.offsetTop <= 0) {
      if (element.firstChild.offsetWidth < element.firstChild.offsetHeight) {
        marginsToApply["marginLeft"] += element.firstChild.offsetWidth + spaceForHandles;
      } else {
        marginsToApply["marginTop"] += element.firstChild.offsetHeight + spaceForHandles;
      }
    } else {
      if (element.firstChild.offsetWidth < element.firstChild.offsetHeight) {
        // TODO the main grid needs right-0 top-0 (or bottom-0 depends) for these to work
        marginsToApply["marginRight"] += element.firstChild.offsetWidth + spaceForHandles;
      } else {
        marginsToApply["marginBottom"] +=
          element.firstChild.offsetHeight + spaceForHandles;
      }
    }
  });
  setParentMargin(marginsToApply);
};
