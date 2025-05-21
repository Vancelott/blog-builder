import { arraySwap } from "@dnd-kit/sortable";
import { ISwapPositions } from "@/app/types/index";

export const swapPositions: ISwapPositions = (
  addedContent,
  setAddedContent,
  draggedComponent,
  newStatus
) => {
  const swappedComponent = addedContent.find((item) => item.id === newStatus);

  setAddedContent((prevAddedContent) => {
    const updatedContent = prevAddedContent.map((component) => {
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
