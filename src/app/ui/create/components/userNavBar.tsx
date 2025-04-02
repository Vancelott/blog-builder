import { PropsWithChildren, useState, useEffect, useRef } from "react";
import { Resizable } from "re-resizable";

interface IUserNavBar {
  positionStyle: string;
  ref: HTMLDivElement;
  size: any;
  tempSizeDelta: any;
}

export function UserNavBar(props: PropsWithChildren<IUserNavBar>) {
  const navRef = useRef();
  const [size, setSize] = useState({
    initialHeight: 0,
    initialWidth: 0,
  });
  const { positionStyle, ref } = props;

  useEffect(() => {
    setSize({
      initialWidth: navRef.current?.offsetWidth,
      initialHeight: navRef.current?.offsetHeight,
    });
  }, []);

  useEffect(() => {
    ref.current = navRef.current;
  }, [positionStyle, ref, navRef]);

  const calculateDimension = (initial, prevDelta, tempDelta) => {
    const base = initial + (prevDelta || 0);
    const temp = tempDelta || 0;
    const total = base + (temp !== 0 ? temp : 0);

    return total > 0 ? total : null;
  };

  return (
    /* TODO make the navbar responsive on mobile, but make the top/bottom options like a drawer possibly */
    <div
      ref={navRef}
      style={{
        width: calculateDimension(
          size.initialWidth,
          props.size?.width,
          props.tempSizeDelta?.width
        ),
        height: calculateDimension(
          size.initialHeight,
          props.size?.height,
          props.tempSizeDelta?.height
        ),
        transition: "none",
      }}
      className={`${
        props.positionStyle
          ? `${props.positionStyle}`
          : "inset-y-0 left-0 place-items-center "
      } flex flex-col fixed justify-start z-10 bg-slate-500`}
      // TODO add w-[${navRef.current?.offsetWidth}px] h-[${navRef.current?.offsetHeight}px] ?
    >
      <div>{props.children}</div>
    </div>
  );
}
