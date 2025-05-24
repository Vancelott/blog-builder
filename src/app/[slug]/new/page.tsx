"use client";

import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { createOrUpdateBlogPost, createOrUpdateDraft, getPage } from "@/app/lib/data";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { notFound } from "next/navigation";
import BlogPostSkeleton from "@/app/ui/slug/blogPostSkeleton";
import { isAuthenticated } from "@/app/utils/blogEditorHelpers/isAuthenticated";
import AuthError from "@/app/ui/create/authError";

export default function Page() {
  const params = useParams<string>();
  const [draftId, setDraftId] = useState<number>(null);
  const [doesBlogExist, setDoesBlogExist] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "heading",
        content: "Title of your blog post",
      },
      {
        type: "paragraph",
      },
      {
        id: "0",
        type: "image",
        props: {
          url: "/defaultBlogPhoto.jpg",
          caption: "Credits to https://unsplash.com/@ashkan_ala",
          previewWidth: 1000,
        },
      },
      {
        type: "paragraph",
      },
      {
        type: "paragraph",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae mollitia ex assumenda sit tempora a placeat quisquam provident quam ad! Id amet vel, accusantium enim temporibus natus quibusdam totam asperiores velit placeat quaerat quae reprehenderit debitis, ad quos excepturi doloremque?",
      },
      {
        type: "paragraph",
      },
      {
        type: "paragraph",
        content:
          "Velit, eligendi saepe. Reprehenderit nobis ad cum facilis nisi voluptatem impedit qui, vitae dolorem sint maxime nulla. Nulla tenetur ducimus quas ex, ea magni quam? Dignissimos illo in rerum reprehenderit voluptates sunt exercitationem a eligendi similique laborum harum id, molestias possimus tempora unde, officia eum asperiores porro ex.",
      },
      {
        type: "paragraph",
      },
      {
        type: "paragraph",
      },
    ],
  });

  useEffect(() => {
    let isDataFetched = false;

    const fetchPageData = async () => {
      setIsLoading(true);

      if (params) {
        try {
          setDoesBlogExist(false);
          const blog = await getPage(params.slug);

          if (!isDataFetched && !blog) {
            setDoesBlogExist(false);
          } else {
            const authenticated = await isAuthenticated(params.slug);
            if (!authenticated) {
              setDoesBlogExist(true);
              setIsLoading(false);
              return;
            }

            setAuthenticated(true);
            setDoesBlogExist(true);
          }
        } catch (error) {
          if (!isDataFetched) {
            console.error("Failed to fetch data", error);
          }
        }
        setIsLoading(false);
      }
    };

    fetchPageData();
    return () => {
      isDataFetched = true;
    };
  }, [params, toast]);

  const handleCreate = async () => {
    const HTMLFromBlocks = await editor.blocksToFullHTML(editor.document);
    const post = await createOrUpdateBlogPost(
      params?.slug,
      HTMLFromBlocks,
      editor.document,
      ""
    );

    if (post.error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: post.error,
      });
    }
  };

  const handleSaveDraft = async () => {
    if (draftId === null) {
      const draft = await createOrUpdateDraft(params?.slug, "", editor.document);
      if (draft.error) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: draft.error ? draft.error : "",
        });
        return;
      }
      setDraftId(draft.id);
    } else if (draftId !== null) {
      const draft = await createOrUpdateDraft(params?.slug, draftId, editor.document);

      if (draft.error) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: draft.error ? draft.error : "",
        });
      }
    }
  };

  if (isLoading) {
    return <BlogPostSkeleton edit={true} userData={true} />;
  }

  if (!doesBlogExist) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full justify-center items-center bg-editor-gray overflow-y-scroll overflow-x-hidden h-screen">
      {!authenticated ? (
        <AuthError blogPost={true} />
      ) : (
        <>
          <div className="flex flex-row w-screen gap-2 bg-gray-700 border-b-2 border-gray-800 px-8 sm:px-16 py-6 mb-10 rounded-lg align-top sticky top-0 place-content-end z-20">
            <Button className=" bg-orange-500" size="lg" onClick={() => handleCreate()}>
              Create
            </Button>
          </div>
          <div className="w-4/5 lg:w-2/5 rounded-lg">
            <BlockNoteView editor={editor} onChange={() => handleSaveDraft()} />
          </div>
        </>
      )}
    </div>
  );
}
