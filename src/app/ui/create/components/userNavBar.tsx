import { PropsWithChildren, useState, useEffect, useRef } from "react";

interface IUserNavBar {
  position: string;
  ref: any;
}

export function UserNavBar(props: PropsWithChildren<IUserNavBar>) {
  const navRef = useRef();
  const [prevPosition, setPrevPosition] = useState();
  const { position, ref } = props;

  // const setPassedRef = useCallback(() => {
  //   if (prevPosition !== position) {
  //     ref({
  //       offsetHeight: navRef.current.offsetHeight,
  //       offsetWidth: navRef.current.offsetWidth,
  //     });
  //   } else {
  //     ref({
  //       offsetHeight: 0,
  //       offsetWidth: 320,
  //     });
  //   }
  // }, []);

  // const updateSize = useCallback(() => {
  //   if (prevPosition !== position) {
  //     setPassedRef();
  //     setPrevPosition(position);
  //   } else {
  //     setPassedRef();
  //   }
  // }, [position, setPassedRef, prevPosition]);

  // useEffect(() => {
  //   updateSize();
  // }, [updateSize]);

  // useEffect(() => {
  //   if (prevPosition !== position) {
  //     ref({
  //       offsetHeight: navRef.current.offsetHeight,
  //       offsetWidth: navRef.current.offsetWidth,
  //     });
  //     setPrevPosition(position);
  //   } else {
  //     ref({
  //       offsetHeight: 0,
  //       offsetWidth: 320,
  //     });
  //   }
  // }, [position]);
  useEffect(() => {
    ref.current = navRef.current;
  }, [position, ref, navRef]);

  return (
    <div>
      {/* TODO make the navbar responsive on mobile, but make the top/bottom options like a drawer possibly */}
      <div
        ref={navRef}
        className={`${
          props.position
            ? `${props.position}`
            : "inset-y-0 left-0 w-80 h-screen place-items-center"
        } flex flex-col absolute justify-start z-10 bg-slate-500 `}
      >
        {/* <p className="text-center text-2xl">Logo</p>
        <p>
          About me: Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p> */}
        {/* {props.children.length == 0 ? (
          <div className="flex flex-col h-screen place-items-start justify-between">
            <div className="p-12 max-w-24 rounded-full border-2 border-dashed border-blue-400"></div>
            <div>
              <p className="w-96 text-center text-xl font-bold text-white">
                Add elements to your navigation
              </p>
            </div>
          </div>
        ) : null} */}
        <div>{props.children}</div>
      </div>
    </div>
  );
}
