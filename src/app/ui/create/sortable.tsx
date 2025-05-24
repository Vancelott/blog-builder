import { React, PropsWithChildren } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ISortable {
  id: string;
  position: object;
  disabled: boolean;
}

export function Sortable(props: PropsWithChildren<ISortable>) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props.id,
    transition: {
      duration: 150,
      easing: "linear",
    },
    disabled: props.disabled,
    animateLayoutChanges: () => false,
  });

  const style = {
    // changed from Transform to Translate due to an issue with the scale of the components
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      // stops the dragging animation when just resizing a component
      style={!props.disabled ? style : null}
      {...attributes}
      {...listeners}
    >
      {props.children}
    </div>
  );
}
