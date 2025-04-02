"use client";

import { useState } from "react";
import { PropsWithChildren } from "react";
import { PositionButtons } from "@/app/ui/create/components/positionButtons";
import { Draggable } from "@/app/ui/create/draggable";
import { IDynamicElement } from "@/app/types/index";
import { TextArea } from "@/app/ui/create/components/textArea";
import { Header } from "@/app/ui/create/components/header";
import { UserNavBar } from "@/app/ui/create/components/userNavBar";
import { ChildElements } from "@/app/ui/create/childElements";
import { CreateComponents } from "@/app/utils/constants";
import { Resizable } from "re-resizable";

export function DynamicElement(props: PropsWithChildren<IDynamicElement>) {
  const [textAreaInput, setTextAreaInput] = useState<string>("");

  // TODO Delete?
  // if (props.element.gridId && props.childElements?.length > 0) {
  //   return (
  //     <div>
  //       <p className="text-2xl text-yellow-400">{positionChange}</p>
  //       {Components.map((mappedComponent) => {
  //         if (mappedComponent.tag === props.element.tag) {
  //           const Component = mappedComponent.component || "div";
  //           return (
  //             <div key={props.element.id}>
  //               <Component handleInputChange={props.handleInputChange}>
  //                 {props.childElements &&
  //                   props.childElements.map((item) => {
  //                     const childComponentDef = Components.find(
  //                       (component) => component.tag === item.tag
  //                     );
  //                     if (childComponentDef) {
  //                       const ChildComponent = childComponentDef.component;
  //                       return;
  //                       <div>
  //                         <ChildComponent
  //                           handleInputChange={props.handleInputChange}
  //                           key={item.id}
  //                           // style={{
  //                           //   left: `${props.element.position.left}px`,
  //                           //   right: `${props.element.position.right}px`,
  //                           // }}
  //                         />
  //                       </div>;
  //                     }
  //                     return null;
  //                   })}
  //               </Component>
  //             </div>
  //           );
  //         }
  //         return null;
  //       })}
  //     </div>
  //   );
  // }
  if (props.element.gridId) {
    return (
      <div>
        {CreateComponents.map((mappedComponent) => {
          if (mappedComponent.tag === props.element.tag) {
            const Component = mappedComponent.component || "div";
            if (props.previewMode) {
              return (
                <div key={props.element.id}>
                  <p>{props.input}</p>
                </div>
              );
            } else {
              return (
                <div key={props.element.id}>
                  <Component
                    handleInputChange={props.handleInputChange}
                    id={props.element.id}
                  />
                </div>
              );
            }
          }
          return null;
        })}
      </div>
    );
  }

  if (props.element.gridId && props.previewMode) {
    return (
      <div key={props.element.id}>
        <p>{props.input}</p>
      </div>
    );
  }

  // if (props.element.tag == "textarea" && props.previewMode) {
  //   console.log("props.previewMode", props.previewMode);
  //   return <p>{textAreaInput.length > 0 ? textAreaInput : "No text"}</p>;
  // }

  if (props.element.tag == "textarea") {
    return (
      <>
        <TextArea
          placeholder="Enter your text here.."
          // className={className}
          isDropped={props.isDropped}
          // TODO create a handle function and add slight debounce
          onChange={(e) => props.input(item.id, e.target.value)}
          value={textAreaInput}
        ></TextArea>
      </>
    );
  }

  if (props.element.tag == "nav bar") {
    return (
      // <Resizable
      //   size={{
      //     width: props.ref.current?.offsetWidth,
      //     height: props.ref.current?.offsetHeight,
      //   }}
      //   onResizeStop={(e, direction, ref, d) => {
      //     // console.log("e", e);
      //     // console.log("direction", direction);
      //     // console.log("ref", ref);
      //     // console.log("d", d);
      // props.ref.current.style.offsetWidth =
      //   props?.ref?.current?.style.offsetWidth + d.width;
      // props.ref.current.style.offsetHeight =
      //   props?.ref?.current?.style.offsetHeight + d.height;
      //   }}
      // >
      <UserNavBar
        positionStyle={props.positionStyle}
        ref={props.ref}
        size={props.element.size}
        tempSizeDelta={props.tempSizeDelta}
      >
        <div className="z-20 mt-8">
          <PositionButtons handlePositionChange={props.handlePositionChange} />
        </div>
        {props.childElements && props.element && (
          <ChildElements
            childElements={props.childElements}
            draggableRef={props.draggableRef}
          />
        )}
      </UserNavBar>
      // </Resizable>
    );
  }

  if (props.element.tag === "header") {
    return <Header />;
  }
}
