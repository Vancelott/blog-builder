"use client";
import { PropsWithChildren, React } from "react";

interface IButton {
  addClassName?: string;
  input: string;
  onClick?: React.MouseEventHandler;
}

export function Button(props: PropsWithChildren<IButton>) {
  const { addClassName, input, onClick } = props;
  return (
    <button
      className={`${
        addClassName ? addClassName : "bg-slate-800 focus:bg-slate-700 text-white text-sm"
      } rounded-md py-2 px-4 border border-transparent text-center transition-all shadow-md hover:shadow-lg `}
      type="button"
      onClick={() => onClick(input)}
    >
      {input}
    </button>
  );
}
