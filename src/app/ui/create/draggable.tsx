import { React, PropsWithChildren } from "react";
import { useDraggable } from "@dnd-kit/core";

interface Draggable {
  id: number;
}

export function Draggable(props: PropsWithChildren<IDraggable>) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    // TODO change the div?
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}
