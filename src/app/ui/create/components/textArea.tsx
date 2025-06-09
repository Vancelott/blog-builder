"use client";

import { useState } from "react";
import TextEditorBlock from "@/app/ui/create/textEditorBlock";
import "@blocknote/shadcn/style.css";
import { Block } from "@blocknote/core";
import { Editor } from "@/app/ui/create/dynamicTextEditorBlock";

export function TextArea({
  handleInputChange,
  id,
  style,
  input,
  inputBlocks,
  isStaticRender,
  isDragOverlayRender,
}) {
  const handleInput = (newInputValue: string, newBlockValue: Block[]) => {
    handleInputChange(id, newInputValue, newBlockValue);
  };

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
      <TextEditorBlock
        handleInput={handleInput}
        id={id}
        input={input}
        blocks={inputBlocks}
      />
    </div>
  );
}
