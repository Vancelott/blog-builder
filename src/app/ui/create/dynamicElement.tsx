"use client";

import { useState } from "react";
import { TextArea } from "@/app/ui/create/components/textArea";
import { UserNavBar } from "@/app/ui/create/components/userNavBar";
import { PropsWithChildren } from "react";
import { PositionButtons } from "@/app/ui/create/components/positionButtons";

interface IDynamicElement {
  element: any;
  className: string;
  previewMode: boolean;
  isDropped: boolean;
  childElements: Array;
  input: any;
  position: string;
  ref: any;
}

export function DynamicElement(props: PropsWithChildren<IDynamicElement>) {
  const [textAreaInput, setTextAreaInput] = useState<string>("");

  const Components = [
    { tag: "textarea", component: TextArea },
    { tag: "nav bar", component: UserNavBar },
  ];

  if (props.element.gridId && props.childElements?.length > 0) {
    return (
      <div>
        <p className="text-2xl text-yellow-400">{positionChange}</p>
        {Components.map((mappedComponent) => {
          if (mappedComponent.tag === props.element.tag) {
            const Component = mappedComponent.component || "div";
            return (
              <div key={props.element.id}>
                <Component handleInputChange={props.handleInputChange}>
                  {props.childElements &&
                    props.childElements.map((item) => {
                      const childComponentDef = Components.find(
                        (component) => component.tag === item.tag
                      );
                      if (childComponentDef) {
                        const ChildComponent = childComponentDef.component;
                        return;
                        <div>
                          <ChildComponent
                            handleInputChange={props.handleInputChange}
                            key={item.id}
                            // style={{
                            //   left: `${props.element.position.left}px`,
                            //   right: `${props.element.position.right}px`,
                            // }}
                          />
                        </div>;
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
  if (props.element.gridId) {
    return (
      <div
        style={{
          left: `${props.element.position.left}px`,
          right: `${props.element.position.right}px`,
        }}
      >
        {Components.map((mappedComponent) => {
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
                    // style={{
                    //   left: `${props.element.position.left}px`,
                    //   right: `${props.element.position.right}px`,
                    // }}
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
      <UserNavBar style={props.positionChange} position={props.position} ref={props.ref}>
        {props.childElements &&
          props.childElements.map((element, index) => (
            <div key={index}>
              {Components.map((mappedComponent, componentsIndex) => {
                if (mappedComponent.tag == props.element.tag) {
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
        <div className="z-20 mt-8">
          <PositionButtons />
        </div>
      </UserNavBar>
    );
  }
}
