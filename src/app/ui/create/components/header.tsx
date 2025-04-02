import { PropsWithChildren, useState, useEffect, useRef } from "react";

interface IHeader {
  positionStyle: string;
  ref: HTMLDivElement;
}

export function Header(props: PropsWithChildren<IHeader>) {
  // const navRef = useRef();
  // const [prevPosition, setPrevPosition] = useState();
  const { positionStyle, ref } = props;

  // useEffect(() => {
  //   ref.current = navRef.current;
  // }, [positionStyle, ref, navRef]);

  return (
    <div
      // ref={navRef}
      className="flex flex-row fixed inset-x-0 top-0 w-screen h-32 place-items-center  justify-start z-5 bg-gray-700"
    >
      <div>{props.children}</div>
    </div>
  );
}
