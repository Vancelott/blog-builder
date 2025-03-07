import { React, PropsWithChildren } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";

interface IDraggableDroppable {
  id: number;
}

export function DraggableDroppable(props: PropsWithChildren<IDraggableDroppable>) {
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: props.id,
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    // transform,
    // isDragging,
  } = useDraggable({
    id: props.id,
  });

  const setNodeRef = (node) => {
    setDroppableRef(node);
    setDraggableRef(node);
  };

  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  );
}
