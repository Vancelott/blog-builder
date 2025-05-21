import { PropsWithChildren, useState, useEffect } from "react";
import { Resize, TempSizeDelta } from "@/app/types/index";

interface IHeader {
  size: Resize;
  tempSizeDelta: TempSizeDelta;
}

export function Header(props: PropsWithChildren<IHeader>) {
  const [size, setSize] = useState({
    initialHeight: 0,
    initialWidth: 0,
  });

  useEffect(() => {
    setSize({
      initialHeight: props.size?.height,
      initialWidth: props.size?.width,
    });
  }, [props.size?.height, props.size?.width]);

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
    <div
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
      className="flex flex-row fixed inset-x-0 top-0 w-screen h-32 place-items-center justify-start z-5 bg-gray-700"
    >
      <div>{props.children}</div>
    </div>
  );
}
