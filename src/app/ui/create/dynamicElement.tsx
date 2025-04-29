"use client";

import { useState } from "react";
import { PropsWithChildren } from "react";
import { Draggable } from "@/app/ui/create/draggable";
import { IDynamicElement } from "@/app/types/index";
import { TextArea } from "@/app/ui/create/components/textArea";
import { Header } from "@/app/ui/create/components/header";
import { UserNavBar } from "@/app/ui/create/components/userNavBar";
import { ChildElements } from "@/app/ui/create/childElements";
import { CreateComponents } from "@/app/utils/constants";

export function DynamicElement(props: PropsWithChildren<IDynamicElement>) {
  const [textAreaInput, setTextAreaInput] = useState<string>("");

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
            }
            return (
              <div key={props.element.id}>
                <Component
                  handleInputChange={props.handleInputChange}
                  id={props.element.id}
                />
              </div>
            );
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
      <UserNavBar
        positionClass={props.element.positionClass}
        ref={props.ref}
        size={props.element.size}
        placement={props.element.position}
        tempSizeDelta={
          props.tempSizeDelta.id == props.element.id ? props.tempSizeDelta : null
        }
      >
        <div className="z-20 mt-8">
          <p>{props.tempSizeDelta.id}</p>
          <p>{props.element.id}</p>
        </div>
        {props.childElements && props.element && (
          <ChildElements
            childElements={props.childElements}
            draggableRef={props.draggableRef}
          />
        )}
      </UserNavBar>
    );
  }

  if (props.element.tag === "header") {
    return (
      <Header
        size={props.element.size}
        tempSizeDelta={
          props.tempSizeDelta.id == props.element.id ? props.tempSizeDelta : null
        }
      />
    );
  }
}
