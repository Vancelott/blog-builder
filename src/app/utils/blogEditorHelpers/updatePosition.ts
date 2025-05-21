import { IUpdatePosition } from "@/app/types/index";

export const updatePosition: IUpdatePosition = (
  setAddedContent,
  elementId,
  newStatus,
  delta
) => {
  setAddedContent((prevAddedContent) => {
    return prevAddedContent.map((component) => {
      if (component.id === elementId) {
        if (isNaN(newStatus)) {
          return {
            ...component,
            gridId: newStatus,
            parentId: null,
            // TODO deleted isDropped?
            isDropped: true,
            position: {
              x: component.position.x + delta.x,
              y: component.position.y + delta.y,
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
            parentId: droppedComponent.dnd === "Droppable" ? newStatus : null,
            isDropped: true,
            position: {
              x: component.position.x + delta.x,
              y: component.position.y + delta.y,
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
