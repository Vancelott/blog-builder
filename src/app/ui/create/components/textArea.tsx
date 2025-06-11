"use client";

import { useMemo } from "react";
import "@blocknote/shadcn/style.css";
import { Block } from "@blocknote/core";
import dynamic from "next/dynamic";
import { RenderedDynamicElement } from "@/app/types/index";

export function TextArea(props: RenderedDynamicElement) {
  const {
    handleInputChange,
    id,
    style,
    input,
    inputBlocks,
    isStaticRender,
    isDragOverlayRender,
  } = props;

  const handleInput = (newInputValue: string, newBlockValue: Block[]) => {
    handleInputChange(id, newInputValue, newBlockValue);
  };

  const EditorBlock = useMemo(
    () => dynamic(() => import("@/components/textEditorBlock"), { ssr: false }),
    []
  );

  if (isStaticRender || isDragOverlayRender) {
    return (
      // TODO update theme if possible
      <div className="bn-container dark bn-shadcn" data-color-scheme="dark">
        <div className="bn-default-styles" dangerouslySetInnerHTML={{ __html: input }} />
      </div>
    );
  }

  return (
    <div style={style}>
      <EditorBlock handleInput={handleInput} id={id} input={input} blocks={inputBlocks} />
    </div>
  );
}
