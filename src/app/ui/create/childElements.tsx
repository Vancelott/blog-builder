import { useEffect, useRef } from "react";
import { Draggable } from "@/app/ui/create/draggable";
import { CreateComponents } from "@/app/utils/constants";

export const ChildElements = ({ childElements, draggableRef }) => {
  const ref = useRef();
  useEffect(() => {
    draggableRef.current = ref.current;
  }, [draggableRef, ref]);

  return childElements?.map((element) => {
    const mappedComponent = CreateComponents.find(
      (component) => component.tag === element.tag
    );

    if (!mappedComponent) return;

    const Component = mappedComponent.component || "div";
    return (
      <Draggable key={element.id} id={element.id}>
        {/* TODO Pass the ref as a prop instead? */}
        <div ref={draggableRef}>
          <Component />
        </div>
      </Draggable>
    );
  });
};
