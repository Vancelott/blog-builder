"use client";

import { useState, useEffect, useMemo } from "react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { BlockNoteEditor } from "@blocknote/core";
import { en } from "@blocknote/core/locales";
import { PartialBlock } from "@blocknote/core";

export default function TextEditorBlock(props) {
  const [initialContent, setInitialContent] = useState<
    PartialBlock[] | undefined | "loading"
  >(undefined);

  const { handleInput } = props;
  const locale = en;

  useEffect(() => {
    setInitialContent(props.blocks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO try to exclude Heading 1 somehow?
  const editor = useMemo(() => {
    if (initialContent === "loading") {
      return undefined;
    }
    if (!initialContent) {
      return BlockNoteEditor.create({
        dictionary: {
          ...locale,
          placeholders: {
            ...locale.placeholders,
            emptyDocument: "Enter your text here..",
            default: "Start typing..",
            heading: "Heading",
          },
        },
      });
    }
    return BlockNoteEditor.create({
      initialContent,
      dictionary: {
        ...locale,
        placeholders: {
          ...locale.placeholders,
          emptyDocument: "Enter your text here..",
          default: "Start typing..",
          heading: "Heading",
        },
      },
    });
  }, [initialContent, locale]);

  const handleOnChange = async () => {
    const HTMLFromBlocks = await editor.blocksToFullHTML(editor.document);
    handleInput(HTMLFromBlocks, editor.document);
  };

  return (
    <BlockNoteView
      editor={editor}
      slashMenu={false}
      sideMenu={false}
      // TODO update theme once it can be toggled
      theme="dark"
      className="text-editor-block w-full h-full"
      onChange={() => handleOnChange()}
    />
  );
}
