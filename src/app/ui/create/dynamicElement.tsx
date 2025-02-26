"use client";

import { useState, createElement } from "react";
import { TextArea } from "@/app/ui/create/components/textArea";
import { SideNavBar } from "@/app/ui/create/components/sideNavBar";

export function DynamicElement({
  tag,
  className,
  previewMode,
  isDropped,
  childElements,
  props,
}) {
  const [textAreaInput, setTextAreaInput] = useState<string>("");

  const Components = [
    { tag: "textarea", component: <TextArea /> },
    { tag: "nav bar", component: <SideNavBar /> },
  ];

  if (tag == "textarea" && previewMode) {
    return (
      // <Draggable>
      <p
      // ref={setNodeRefDraggable} style={styleDraggable}
      >
        {textAreaInput.length > 0 ? textAreaInput : "No text"}
      </p>
      /* </Draggable> */
    );
  }

  if (tag == "textarea") {
    return (
      <TextArea // ref={setNodeRefDraggable}
        // style={styleDraggable}
        placeholder="Enter your text here.."
        // className={className}
        isDropped={isDropped}
        // TODO create a handle function and add slight debounce
        onChange={(e) => setTextAreaInput(e.target.value)}
        value={textAreaInput}
      ></TextArea>
    );
  }

  if (tag == "nav bar") {
    return (
      <SideNavBar>
        {childElements &&
          childElements.map((element, index) => (
            <div key={index}>
              {Components.map((mappedComponent, componentsIndex) => {
                if (mappedComponent.tag == element.tag) {
                  const Component = mappedComponent.component || "div";
                  return <div key={componentsIndex}>{Component}</div>;
                }
              })}
            </div>
          ))}
      </SideNavBar>
    );
  }

  // if (tag == "nav bar") {
  //   return (
  //     <SideNavBar>
  //       {childElements &&
  //         childElements.map((element, index) => (
  //           <div key={index}>
  //             <textarea
  //               placeholder="Enter your text here..."
  //               className={className}
  //               onChange={(e) => setTextAreaInput(e.target.value)}
  //               value={textAreaInput}
  //             />
  //             <p>{element.id}</p>
  //           </div>
  //         ))}
  //     </SideNavBar>
  //   );
  // }

  // if (tag == "nav bar") {
  //   return (
  //     // <Droppable>
  //     <div
  //     // ref={setNodeRefDroppable}
  //     // style={styleDroppable}
  //     // {...listeners}
  //     // {...attributes}
  //     >
  //       <div className="flex flex-col h-screen w-28 justify-center content-between place-items-center relative z-10 bg-slate-500 py-8 px-52">
  //         <p className="text-center text-nowrap text-2xl">Logo</p>
  //         <p>About me: adfafasfafda</p>
  //         <p className={`${isDropped ? "text-green-500" : "text-red-500"}`}>
  //           {isDropped ? "Dropped" : "Not Dropped"}
  //         </p>
  // {childElements &&
  //   childElements.map((element, index) => (
  //     <div key={index}>
  //       <textarea
  //         placeholder="Enter your text here..."
  //         className={className}
  //         onChange={(e) => setTextAreaInput(e.target.value)}
  //         value={textAreaInput}
  //       />
  //       <p>{element.tag}</p>
  //     </div>
  //   ))}
  //       </div>
  //     </div>
  //     /* </Droppable> */
  //   );
  // }
}
