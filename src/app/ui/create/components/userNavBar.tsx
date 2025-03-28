import { PropsWithChildren, useState, useEffect, useRef } from "react";

interface IUserNavBar {
  positionStyle: string;
  ref: HTMLDivElement;
}

export function UserNavBar(props: PropsWithChildren<IUserNavBar>) {
  const navRef = useRef();
  const [prevPosition, setPrevPosition] = useState();
  const { positionStyle, ref } = props;

  useEffect(() => {
    ref.current = navRef.current;
  }, [positionStyle, ref, navRef]);

  return (
    /* TODO make the navbar responsive on mobile, but make the top/bottom options like a drawer possibly */
    <div
      ref={navRef}
      className={`${
        props.positionStyle
          ? `${props.positionStyle}`
          : "inset-y-0 left-0 w-80 h-screen place-items-center"
      } flex flex-col fixed justify-start z-10 bg-slate-500 `}
    >
      <div>{props.children}</div>
    </div>
  );
}
