import { PropsWithChildren } from "react";

interface IUserNavBar {
  position: "top" | "bottom" | "left" | "right";
}

export function UserNavBar(props: PropsWithChildren<IUserNavBar>) {
  return (
    <div>
      <div className="flex flex-col h-screen w-28 justify-center place-items-center z-10 bg-slate-500 py-8 px-52">
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
