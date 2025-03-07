"use client";

import { React, PropsWithChildren } from "react";
import { useDroppable } from "@dnd-kit/core";

interface IDroppable {
  id: number;
}

export function Droppable(props: PropsWithChildren<IDroppable>) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });

  // const style = {
  //   color: isOver ? "green" : undefined,
  // };
  const style = {};

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}
