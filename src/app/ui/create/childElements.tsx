"use client";

import { useEffect, useRef } from "react";
import { Draggable } from "@/app/ui/create/draggable";
import { Sortable } from "@/app/ui/create/sortable";
import { CreateComponents } from "@/app/utils/constants";
import { Resizable } from "re-resizable";
import { SortableContext, rectSwappingStrategy } from "@dnd-kit/sortable";
import { RenderedDynamicElement } from "@/app/types/index";

export const ChildElements = ({
  childElements,
  draggableRef,
  isStaticRender,
  handlers,
}) => {
  const {
    handleInputChange,
    handleSelectComponent,
    handleUpdateCompSize,
    toggleComponentDraggable,
    setTempSizeDelta,
  } = handlers;
  return childElements?.map((element) => {
    const mappedComponent = CreateComponents.find(
      (component) => component.tag === element.tag
    );

    if (!mappedComponent) return;

    const Component: RenderedDynamicElement = mappedComponent.component || "div";
    return (
      <SortableContext
        key={element.id}
        items={childElements.map((component) => component.id)}
        strategy={rectSwappingStrategy}
      >
        <Sortable
          id={element.id}
          key={element.id}
          position={element.position}
          disabled={element.disabled}
        >
          <div
            ref={draggableRef !== undefined ? draggableRef : null}
            style={{
              width: element.size.width,
              height: element.size.height,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectComponent(element.id);
            }}
          >
            <Resizable
              size={{
                width: element.size.width,
                height: element.size.height,
              }}
              minHeight={element.size.minHeight}
              minWidth={element.size.minWidth}
              onResizeStop={(e, direction, ref, d) => {
                handleUpdateCompSize(element.id, d);
              }}
              onResize={(e, direction, ref, d) => {
                if (!element.disabled) {
                  toggleComponentDraggable(element.id);
                }
                setTempSizeDelta({
                  width: d.width,
                  height: d.height,
                  id: element.id,
                });
              }}
              // className={`${element.positionClass}`}
            >
              <Component
                positionClass={element.positionClass}
                id={element.id}
                input={element.input}
                inputBlocks={element.inputBlocks}
                style={{
                  width: element.size.width,
                  height: element.size.height,
                }}
                handleInputChange={handleInputChange}
                isStaticRender={isStaticRender}
              />
            </Resizable>
          </div>
        </Sortable>
      </SortableContext>
    );
  });
};
