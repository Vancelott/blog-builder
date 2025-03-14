"use client";

import { React, PropsWithChildren } from "react";
import { useDroppable } from "@dnd-kit/core";

interface IDroppable {
  id: string;
  className: string;
}

export function Droppable(props: PropsWithChildren<IDroppable>) {
  // console.log("droppable props.id", props.id);

  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });

  // const style = {
  //   color: isOver ? "green" : undefined,
  // };
  const style = {};

  return (
    <div ref={setNodeRef} style={style} className={props.className}>
      {props.children}
    </div>
  );
}
