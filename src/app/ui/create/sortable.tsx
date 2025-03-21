import { React, PropsWithChildren } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ISortable {
  id: string;
  position: object;
}

export function Sortable(props: PropsWithChildren<ISortable>) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props.id,
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // transform: CSS.Transform.toString(
    //   transform && `translate3d(${props.position.x}px, ${props.position.y}px, 0)`
    // ),
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  );
}
