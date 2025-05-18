"use client";

import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { getBlogPost, getDraftPost } from "@/app/lib/data";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import "@blocknote/shadcn/style.css";
import { createOrUpdateDraft, createBlogPost } from "@/app/lib/data";
import { Button } from "@/components/ui/button";

export default function Page() {
  const params = useParams<string>();
  const [initialContent, setInitialContent] = useState<
    PartialBlock[] | undefined | "loading"
  >("loading");
  const isDraft = parseInt(params.post);

  const editor = useMemo(() => {
    if (initialContent === "loading") {
      return undefined;
    }
    return BlockNoteEditor.create({ initialContent });
  }, [initialContent]);

  // const editorPost = useCreateBlockNote();

  useEffect(() => {
    let isDataFetched = false;

    const fetchPageContent = async () => {
      if (params) {
        try {
          let data;

          if (isDraft) {
            const { editor_data } = await getDraftPost(params.post);
            data = JSON.parse(editor_data) as PartialBlock[];
          } else {
            // const { html } = await getBlogPost(params.post);
            // const blocksFromHTML = await editorPost.tryParseHTMLToBlocks(html);
            // editorPost.replaceBlocks(editorPost.document, blocksFromHTML);
            // data = blocksFromHTML;
            // setIsPost(true);
            const post = await getBlogPost(params.post);
            data = JSON.parse(post.editor_data) as PartialBlock[];
          }
          if (!isDataFetched) {
            setInitialContent(data);
          }
        } catch (error) {
          if (!isDataFetched) {
            console.error("Failed to fetch data", error);
          }
        }
      }
    };

    fetchPageContent();
    return () => {
      isDataFetched = true;
    };
  }, [isDraft, params]);

  const handleCreate = async () => {
    const HTMLFromBlocks = await editor.blocksToFullHTML(editor.document);
    createBlogPost(params?.slug, HTMLFromBlocks, editor.document);
  };

  // TODO add debounce?
  const handleSaveDraft = async () => {
    createOrUpdateDraft(params?.slug, params.post, editor.document);
  };

  // TODO handle editor load
  if (editor === undefined) {
    return "Loading content...";
  }

  return (
    <div className="flex flex-col w-full justify-center items-center bg-editor-gray overflow-y-scroll overflow-x-hidden h-screen">
      <div className="flex flex-row w-screen gap-2 bg-gray-700 border-b-2 border-gray-800 px-8 sm:px-16 py-6 mb-10 rounded-lg align-top sticky top-0 place-content-end z-20">
        <Button className=" bg-orange-500" size="lg" onClick={() => handleCreate()}>
          {isDraft ? "Create" : "Update"}
        </Button>
      </div>
      <div className="w-4/5 lg:w-2/5 rounded-lg">
        <BlockNoteView
          editor={editor}
          onChange={() => {
            handleSaveDraft(editor.document);
          }}
        />
      </div>
    </div>
  );
}
