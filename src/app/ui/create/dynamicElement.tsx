"use client";

import { useState, useEffect, useCallback } from "react";
import { PropsWithChildren } from "react";
import { IDynamicElement } from "@/app/types/index";
import { TextArea } from "@/app/ui/create/components/textArea";
import { Header } from "@/app/ui/create/components/header";
import { UserNavBar } from "@/app/ui/create/components/userNavBar";
import { ChildElements } from "@/app/ui/create/childElements";
import { CreateComponents } from "@/app/utils/constants";

export function DynamicElement(props: PropsWithChildren<IDynamicElement>) {
  // const [textAreaInput, setTextAreaInput] = useState<string>("");

  const [screenSize, setScreenSize] = useState<{ [name: string]: number }>({
    width: window?.innerWidth,
    height: window?.innerHeight,
    initialWidth: window?.innerWidth,
    initialHeight: window?.innerHeight,
    // width: 0,
    // height: 0,
    // initialWidth: 0,
    // initialHeight: 0,
    deltaX: 0,
    deltaY: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        ...screenSize,
        width: window.innerWidth,
        height: window.innerHeight,
        deltaX: window.innerWidth - screenSize.initialWidth,
        deltaY: window.innerHeight - screenSize.initialHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [screenSize]);

  const calculatePosition = useCallback(
    (pos: string) => {
      if (pos === "X") {
        const gridWidth = props.mainGridRef?.current?.offsetWidth;
        const elementX = props.element.position.x;
        const elementWidth = props.element.size.width;

        // use original comp position
        if (elementX + elementWidth <= gridWidth) {
          return elementX;
        }

        // Adjusted position based on delta
        const adjustedX = elementX + screenSize?.deltaX;

        // Clamp to grid bounds
        if (adjustedX < 0) {
          return 0;
        } else if (adjustedX + elementWidth > gridWidth) {
          return gridWidth - elementWidth;
        }
        return adjustedX;
      } else if (pos === "Y") {
        const gridHeight = props.mainGridRef?.current?.offsetHeight;
        const elementY = props.element.position.y;
        const elementHeight = props.element.size.height;

        // use original comp position
        if (elementY + elementHeight <= gridHeight) {
          return elementY;
        }

        // Adjusted position based on delta
        const adjustedY = elementY + screenSize?.deltaY;

        // Clamp to grid bounds
        if (adjustedY < 0) {
          return 0;
        } else if (adjustedY + elementHeight > gridHeight) {
          return gridHeight - elementHeight;
        }
        return adjustedY;
      }
    },
    [
      props.element.position.x,
      props.element.position.y,
      props.element.size.height,
      props.element.size.width,
      props.mainGridRef,
      screenSize?.deltaX,
      screenSize?.deltaY,
    ]
  );

  if (props.element.gridId) {
    return (
      <>
        {CreateComponents.map((mappedComponent) => {
          if (mappedComponent.tag === props.element.tag) {
            const Component = mappedComponent.component || "div";
            // if (props.previewMode) {
            //   return (
            //     <div key={props.element.id}>
            //       <p>{props.input}</p>
            //     </div>
            //   );
            // }
            return (
              <div
                key={props.element.id}
                style={
                  props.shouldAdjustPosition
                    ? {
                        transform: `translate3d(${calculatePosition(
                          "X"
                        )}px, ${calculatePosition("Y")}px, 0)`,
                        width: props.element.size.width,
                        height: props.element.size.height,
                      }
                    : null
                }
              >
                <Component
                  positionClass={props.element.positionClass}
                  id={props.element.id}
                  input={props.element.input}
                  style={{
                    width: props.element.size.width,
                    height: props.element.size.height,
                  }}
                  handleInputChange={props.handleInputChange}
                  shouldAdjustPosition={props.shouldAdjustPosition}
                >
                  <div className="z-20 mt-8"></div>
                  {props.childElements && props.element && (
                    <ChildElements
                      childElements={props.childElements}
                      draggableRef={props.draggableRef}
                    />
                  )}
                </Component>
              </div>
            );
          }
          return null;
        })}
      </>
    );
  }

  // if (props.element.tag == "nav bar") {
  //   return (
  //     <UserNavBar
  //       positionClass={props.element.positionClass}
  //       ref={props.ref}
  //       size={props.element.size}
  //       placement={props.element.position}
  //       tempSizeDelta={
  //         props.tempSizeDelta?.id == props.element.id ? props.tempSizeDelta : null
  //       }
  //     >
  //       <div className="z-20 mt-8"></div>
  //       {props.childElements && props.element && (
  //         <ChildElements
  //           childElements={props.childElements}
  //           draggableRef={props.draggableRef}
  //         />
  //       )}
  //     </UserNavBar>
  //   );
  // }

  if (props.element.tag === "header") {
    return (
      <Header
        size={props.element.size}
        tempSizeDelta={
          props.tempSizeDelta?.id == props.element.id ? props.tempSizeDelta : null
        }
      />
    );
  }
}
