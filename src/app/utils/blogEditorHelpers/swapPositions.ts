import { arraySwap, arrayMove } from "@dnd-kit/sortable";
import { ISwapPositions } from "@/app/types/index";

export const swapPositions: ISwapPositions = (
  addedContent,
  setAddedContent,
  draggedComponent,
  newStatus
) => {
  const swappedComponent = addedContent.find((item) => item.id === newStatus);
  if (draggedComponent.parentId === swappedComponent.parentId) {
    const parentComp = addedContent.find((item) => item.id === draggedComponent.parentId);
    const draggedCompIndex = parentComp.otherElements.findIndex(
      (element) => element.id === draggedComponent.id
    );
    const swappedCompIndex = parentComp.otherElements.findIndex(
      (element) => element.id === swappedComponent.id
    );

    const reorderedElements = arrayMove(
      parentComp.otherElements,
      draggedCompIndex,
      swappedCompIndex
    );

    setAddedContent((prevAddedContent) => {
      return prevAddedContent.map((component) => {
        if (component.id === parentComp.id) {
          return {
            ...component,
            otherElements: reorderedElements,
          };
        }
        return component;
      });
    });
  }
  const updatedContent = setAddedContent((prevAddedContent) => {
    return prevAddedContent.map((component) => {
      if (component.id === draggedComponent.id) {
        return {
          ...component,
          position: swappedComponent.position,
        };
      } else if (component.id === swappedComponent.id) {
        return {
          ...component,
          position: draggedComponent.position,
        };
      }
      return component;
    });

    return arraySwap(updatedContent, draggedComponent.id, swappedComponent.id);
  });
};
