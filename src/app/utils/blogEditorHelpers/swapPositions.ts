import { arraySwap, arrayMove } from "@dnd-kit/sortable";
import { ISwapPositions } from "@/app/types/index";

// TODO MAIN ISSUE using "props" instead of all 4 props results in the props being undefined
// Update: Not sure what I was doing wrong, but if I update the call to this function to ({allAddedContent, setAddedContent, draggedComponent, newStatus}) and then just reference them as props here, it should all be good?
export const swapPositions = (
  allAddedContent,
  setAddedContent,
  draggedComponent,
  newStatus
): ISwapPositions => {
  // const { allAddedContent, setAddedContent, draggedComponent, newStatus } = props;
  console.log({ allAddedContent, setAddedContent, draggedComponent, newStatus });
  const swappedComponent = allAddedContent.find((item) => item.id === newStatus);

  const sameParent =
    draggedComponent.parentId !== null &&
    swappedComponent.parentId !== null &&
    draggedComponent.parentId === swappedComponent.parentId;

  // swap between child components within a parent component
  // TODO check if this still works
  if (sameParent) {
    const parentComp = allAddedContent.find(
      (item) => item.id === draggedComponent.parentId
    );
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

    setAddedContent((prev) => ({
      ...prev,
      byId: {
        ...prev.byId,
        [parentComp.id]: {
          ...parentComp,
          otherElements: reorderedElements,
        },
      },
    }));
  }
  // TODO else? but it won't make sense i think
  setAddedContent((prev) => ({
    ...prev,
    byId: {
      ...prev.byId,
      [draggedComponent.id]: {
        ...draggedComponent,
        position: swappedComponent.position,
      },
      [swappedComponent.id]: {
        ...swappedComponent,
        position: draggedComponent.position,
      },
    },
  }));
};
