"use client";

import { useState, useEffect, useMemo } from "react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { BlockNoteSchema, defaultBlockSpecs, BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { en } from "@blocknote/core/locales";
import { Block } from "@blocknote/core";

// const schema = BlockNoteSchema.create({
//   blockSpecs: {
//     // Adds all default blocks.
//     ...defaultBlockSpecs,
//   },
// });

export default function TextEditorBlock(props) {
  const [initialContent, setInitialContent] = useState<Block[] | undefined>(undefined);

  const { handleInput } = props;
  const locale = en;
  const {} = defaultBlockSpecs;

  useEffect(() => {
    setInitialContent(props.blocks);
  }, []);

  const editor = useMemo(() => {
    if (!initialContent) {
      return BlockNoteEditor.create({
        dictionary: {
          locale: en,
          placeholders: {
            ...locale.placeholders,
            default: "Enter your text here..",
          },
        },
      });
    }
    return BlockNoteEditor.create({
      initialContent,
      dictionary: {
        locale: en,
        placeholders: {
          ...locale.placeholders,
          default: "Enter your text here..",
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContent]);

  const handleOnChange = async () => {
    const HTMLFromBlocks = await editor.blocksToFullHTML(editor.document);
    handleInput(HTMLFromBlocks, editor.document);
  };

  return (
    <BlockNoteView
      editor={editor}
      slashMenu={false}
      sideMenu={false}
      className="text-editor-block w-full h-full"
      onChange={() => handleOnChange()}
      // style={props.style}
      // formattingToolbar={false}
    >
      {/* TODO It will be better if Heading 1 is excluded, but it doesn't seem possible atm. Maybe make the paragraph the only available block, and make it so that its size can be adjusted*/}
      {/* <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar
            // Sets the items in the Block Type Select.
            blockTypeSelectItems={[
              // gets the default Block Type Select items.
              ...blockTypeSelectItems(editor.dictionary),
            ]}
          />
        )}
      /> */}
    </BlockNoteView>
  );
}
