import { IUpdatePosition } from "@/app/types/index";

export const updatePosition: IUpdatePosition = (
  allAddedContent,
  setAddedContent,
  elementId,
  newStatus,
  delta,
  screenSize,
) => {
  // const calculatePercentage = (compPos, delta, screen) => {
  //   if (compPos !== 0) {
  //     const deltaPercent = (delta / screen) * 100;

  //     return Math.max(0, Math.min(100, compPos + deltaPercent));
  //   }

  //   return ((compPos + delta) / screen) * 100;
  // };

  const comp = allAddedContent.find((item) => item.id === elementId);

  // if newStatus is not a number, the component has just been dragged and dropped on the grid
  if (isNaN(newStatus)) {
    const parentComp = allAddedContent.find((item) => item.id === comp.parentId);

    setAddedContent((prev) => ({
      ...prev,
      byId: {
        ...prev.byId,
        ...(parentComp && {
          [comp.parentId]: {
            ...prev.byId[comp.parentId],
            otherElements: prev.byId[comp.parentId].otherElements.filter(
              (item) => item.id !== comp.id,
            ),
          },
        }),
        [comp.id]: {
          ...comp,
          gridId: newStatus,
          parentId: null,
          // TODO delete isDropped?
          isDropped: true,
          position: {
            x: comp.position.x + delta.x,
            y: comp.position.y + delta.y,
            // xPercent: calculatePercentage(
            //   !comp.position.xPercent ? comp.position.x : comp.position.xPercent,
            //   delta.x,
            //   screenSize.width,
            // ),
            // yPercent: calculatePercentage(
            //   !comp.position.yPercent ? comp.position.y : comp.position.yPercent,
            //   delta.y,
            //   screenSize.height,
            // ),
          },
        },
      },
    }));
    // comp has been dragged from one droppable to another droppable
  } else if (comp.parentId != null && !isNaN(newStatus)) {
    const currentParent = allAddedContent.find((item) => item.id === comp.parentId);
    const newParent = allAddedContent.find((item) => item.id === newStatus);

    setAddedContent((prev) => ({
      ...prev,
      byId: {
        ...prev.byId,
        ...(currentParent && {
          [comp.parentId]: {
            ...prev.byId[comp.parentId],
            otherElements: prev.byId[comp.parentId].otherElements.filter(
              (item) => item.id !== comp.id,
            ),
          },
        }),
        ...(newParent && {
          [newStatus]: {
            ...prev.byId[newStatus],
            otherElements: [...prev.byId[newStatus].otherElements, comp],
          },
        }),
      },
    }));
    // handles the case where a child comp has been dropped into parent (droppable) comp
  } else {
    const parentComp = allAddedContent.find(
      (item) => item.id === (newStatus ?? comp.parentId),
    );

    const addChild = [...parentComp?.otherElements, comp];
    const updatedComp = {
      ...comp,
      parentId: parentComp?.dnd === "Droppable" ? parentComp.id : null, // prevents an update of parentId to a swappable (draggable) component
      position: {
        x: comp.position.x + delta.x,
        y: comp.position.y + delta.y,
      },
    };
    const updatedParent = {
      ...parentComp,
      otherElements: addChild,
    };

    setAddedContent((prev) => ({
      // el1 gets dropped in el2 -> el1.parentId = el2.id ; el2.otherElements = [..., el1]
      // el1 gets dropped onto grid -> el1.parentId = null ; el2.otherElements.filter without el1

      ...prev,
      byId: {
        ...prev.byId,
        [comp.id]: {
          ...updatedComp,
        },
        [parentComp.id]: {
          ...updatedParent,
        },
      },
    }));
  }
};
