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
    transition: {
      duration: 150,
      easing: "linear",
    },
    animateLayoutChanges: () => false,
  });

  const style = {
    // changed from Transform to Translate due to an issue with the scale of the components
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  );
}
