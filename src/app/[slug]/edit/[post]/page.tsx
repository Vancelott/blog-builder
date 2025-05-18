"use client";

import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { getBlogPost, getDraftPost } from "@/app/lib/data";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import "@blocknote/shadcn/style.css";
import { createOrUpdateDraft, createOrUpdateBlogPost } from "@/app/lib/data";
import { Button } from "@/components/ui/button";

export default function Page() {
  const params = useParams<string>();
  const [initialContent, setInitialContent] = useState<
    PartialBlock[] | undefined | "loading"
  >("loading");
  const [postSlug, setPostSlug] = useState<string>("");

  const editor = useMemo(() => {
    if (initialContent === "loading") {
      return undefined;
    }
    return BlockNoteEditor.create({ initialContent });
  }, [initialContent]);

  useEffect(() => {
    let isDataFetched = false;

    const fetchPageContent = async () => {
      if (params) {
        const isDraft = parseInt(params.post);

        try {
          let data;

          if (isDraft) {
            const draft = await getDraftPost(params.post);
            data = JSON.parse(draft.editor_data) as PartialBlock[];
            console.log(data);
          } else {
            const post = await getBlogPost(params.post);
            data = JSON.parse(post.editor_data) as PartialBlock[];
            console.log(data);
            setPostSlug(post.slug);
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
  }, [params]);

  const handleCreateOrUpdate = async () => {
    const HTMLFromBlocks = await editor.blocksToFullHTML(editor.document);
    createOrUpdateBlogPost(params?.slug, HTMLFromBlocks, editor.document, postSlug);
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
        <Button
          className=" bg-orange-500"
          size="lg"
          onClick={() => handleCreateOrUpdate()}
        >
          {!postSlug ? "Create" : "Update"}
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
