"use client";

import { useState } from "react";
import { TextArea } from "@/app/ui/create/components/textArea";
import { UserNavBar } from "@/app/ui/create/components/userNavBar";
import { PropsWithChildren } from "react";

interface IDynamicElement {
  tag: string;
  id: number;
  className: string;
  previewMode: boolean;
  isDropped: boolean;
  childElements: Array;
  gridId: string;
}

export function DynamicElement(props: PropsWithChildren<IDynamicElement>) {
  const [textAreaInput, setTextAreaInput] = useState<string>("");

  const Components = [
    { tag: "textarea", component: TextArea },
    { tag: "nav bar", component: UserNavBar },
  ];

  // {
  //   Components.map((mappedComponent, componentsIndex) => {
  //     if (mappedComponent.tag == element.tag) {
  //       const Component = mappedComponent.component || "div";
  //       return (
  //         <Component key={componentsIndex}>
  //           {element.otherElements?.map((item, index) => {
  //             if (mappedComponent.tag == item.tag) {
  //               const MappedElement = mappedComponent.component || null;
  //               return (
  //                 <div key={item.id}>
  //                   <p>{item.id}</p>
  //                   <MappedElement />
  //                 </div>
  //               );
  //             }
  //           })}
  //         </Component>
  //       );
  //     }
  //   });
  // }

  if (props.gridId && props.childElements?.length > 0) {
    return (
      <div>
        <p className="text-2xl text-yellow-400">{positionChange}</p>
        {Components.map((mappedComponent) => {
          if (mappedComponent.tag === props.tag) {
            const Component = mappedComponent.component || "div";
            return (
              <div key={props.id}>
                <Component>
                  {props.childElements &&
                    props.childElements.map((item) => {
                      const childComponentDef = Components.find(
                        (component) => component.tag === item.tag
                      );
                      if (childComponentDef) {
                        const ChildComponent = childComponentDef.component;
                        return <ChildComponent key={item.id} />;
                      }
                      return null;
                    })}
                </Component>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }
  if (props.gridId) {
    return (
      <div>
        {Components.map((mappedComponent) => {
          if (mappedComponent.tag === props.tag) {
            const Component = mappedComponent.component || "div";
            return (
              <div key={props.id}>
                <Component />
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }

  // backup
  // if (gridId) {
  //   return (
  //     <div>
  //       {childElements &&
  //         childElements.map((element, index) => (
  //           <div key={index}>
  //             {Components.map((mappedComponent, componentsIndex) => {
  //               if (mappedComponent.tag == element.tag) {
  //                 const Component = mappedComponent.component || "div";
  //                 return (
  //                   <div key={componentsIndex}>
  //                     <Component />
  //                   </div>
  //                 );
  //               }
  //             })}
  //           </div>
  //         ))}
  //     </div>
  //   );
  // }

  if (props.tag == "textarea" && props.previewMode) {
    return <p>{textAreaInput.length > 0 ? textAreaInput : "No text"}</p>;
  }

  if (props.tag == "textarea") {
    return (
      <TextArea
        placeholder="Enter your text here.."
        // className={className}
        isDropped={props.isDropped}
        // TODO create a handle function and add slight debounce
        onChange={(e) => setTextAreaInput(e.target.value)}
        value={textAreaInput}
      ></TextArea>
    );
  }

  if (props.tag == "nav bar") {
    return (
      <UserNavBar style={props.positionChange}>
        {props.childElements &&
          props.childElements.map((element, index) => (
            <div key={index}>
              {Components.map((mappedComponent, componentsIndex) => {
                if (mappedComponent.tag == element.tag) {
                  const Component = mappedComponent.component || "div";
                  return (
                    <Component key={componentsIndex}>
                      {element.otherElements?.map((item, index) => {
                        if (mappedComponent.tag == item.tag) {
                          const MappedElement = mappedComponent.component || null;
                          return <MappedElement key={item.id} />;
                        }
                      })}
                    </Component>
                  );
                }
              })}
            </div>
          ))}
        {props.children}
      </UserNavBar>
    );
  }
}
