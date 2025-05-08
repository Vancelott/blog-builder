import { PropsWithChildren, useState, useEffect, useRef } from "react";
import { Resize, TempSizeDelta } from "@/app/types/index";

interface IUserNavBar {
  positionClass: string;
  ref: HTMLDivElement;
  size: Resize;
  tempSizeDelta: TempSizeDelta;
  placement: string;
}

export function UserNavBar(props: PropsWithChildren<IUserNavBar>) {
  const navRef = useRef();
  const [size, setSize] = useState({
    initialHeight: 0,
    initialWidth: 0,
    placement: props.placement,
  });
  const { positionClass, ref } = props;

  useEffect(() => {
    setSize({
      initialWidth: navRef.current?.offsetWidth,
      initialHeight: navRef.current?.offsetHeight,
    });
  }, []);

  useEffect(() => {
    if (props.placement !== size.placement) {
      setSize({
        initialWidth: navRef.current?.offsetWidth,
        initialHeight: navRef.current?.offsetHeight,
      });
    }
  }, [props.placement, size.placement]);

  useEffect(() => {
    if (navRef && ref) {
      ref.current = navRef.current;
    }
  }, [ref, navRef]);

  const calculateDimension = (initial: number, prevDelta: number, tempDelta: number) => {
    if (!tempDelta && !prevDelta) {
      return null;
    }

    const base = initial + (prevDelta || 0);
    const temp = tempDelta || 0;
    const total = base + (temp !== 0 ? temp : 0);

    return total > 0 ? total : null;
  };

  return (
    /* TODO make the navbar responsive on mobile, but make the top/bottom options like a drawer possibly */
    <div
      ref={navRef}
      data-type="navbar"
      style={{
        width: calculateDimension(
          size.initialWidth,
          props.size?.deltaWidth,
          props.tempSizeDelta?.width
        ),
        height: calculateDimension(
          size.initialHeight,
          props.size?.deltaHeight,
          props.tempSizeDelta?.height
        ),
        transition: "none",
      }}
      className={`${
        positionClass ? `${positionClass}` : "inset-y-0 left-0 place-items-center "
      } flex flex-col fixed justify-start z-10 bg-slate-500`}
      // TODO add w-[${navRef.current?.offsetWidth}px] h-[${navRef.current?.offsetHeight}px] ?
    >
      <div>{props.children}</div>
    </div>
  );
}
