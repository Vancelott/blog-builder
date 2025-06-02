import { IUpdatePosition } from "@/app/types/index";

export const updatePosition: IUpdatePosition = (
  setAddedContent,
  elementId,
  newStatus,
  delta,
  screenSize
) => {
  // TODO once this is done, maybe make it so that the width/height get scaled accordingly as well? Read through - https://medium.com/@miheer.sharma1/responsive-scene-elements-in-react-js-video-editor-9bc7d7730ed0 again
  const calculatePercentage = (compPos, delta, screen) => {
    if (compPos !== 0) {
      const deltaPercent = (delta / screen) * 100;

      return Math.max(0, Math.min(100, compPos + deltaPercent));
    }

    return ((compPos + delta) / screen) * 100;
  };

  setAddedContent((prevAddedContent) => {
    return prevAddedContent.map((component) => {
      if (component.id === elementId) {
        if (isNaN(newStatus)) {
          return {
            ...component,
            gridId: newStatus,
            parentId: null,
            // TODO delete isDropped?
            isDropped: true,
            position: {
              x: component.position.x + delta.x,
              y: component.position.y + delta.y,
              xPercent: calculatePercentage(
                !component.position.xPercent
                  ? component.position.x
                  : component.position.xPercent,
                delta.x,
                screenSize.width
              ),
              yPercent: calculatePercentage(
                !component.position.yPercent
                  ? component.position.y
                  : component.position.yPercent,
                delta.y,
                screenSize.height
              ),
            },
          };
        } else {
          // used to prevent an accidental update of parentId to a swappable component
          const droppedComponent = prevAddedContent.find(
            (component) => component.id === newStatus
          );

          return {
            ...component,
            // TODO uncomment or delete once components don't get dragged upon resizing
            // gridId: null,
            parentId: droppedComponent?.dnd === "Droppable" ? newStatus : null,
            isDropped: true,
            position: {
              x: component.position.x + delta.x,
              y: component.position.y + delta.y,
              // TODO is the percentage based position needed here?
              // xPercent: calculatePercentage(
              //   component.position.xPercent ?? component.position.x,
              //   delta.x,
              //   screenSize.width
              // ),
              // yPercent: calculatePercentage(
              //   component.position.yPercent ?? component.position.y,
              //   delta.y,
              //   screenSize.height
              // ),
            },
          };
        }
      }

      // if the comp has been dropped into a "parent" comp, it has to be added to its `otherElements` array
      if (component.id === newStatus) {
        const updatedElement = prevAddedContent.find((item) => item.id === elementId);
        return {
          ...component,
          otherElements: [...component.otherElements, updatedElement],
        };
      }

      return component;
    });
  });
};
