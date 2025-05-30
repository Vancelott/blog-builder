import { React, PropsWithChildren } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface Draggable {
  id: number;
}

export function Draggable(props: PropsWithChildren<IDraggable>) {
  // console.log("draggable props.id", props.id);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });

  // const style = transform
  //   ? {
  //       transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  //     }
  //   : undefined;

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    // TODO change the div?
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}
