"use client";

import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useParams } from "next/navigation";
import { createBlogPost } from "@/app/lib/data";

export default function Page() {
  const params = useParams<string>();

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

  const handleCreate = async () => {
    const HTMLFromBlocks = await editor.blocksToFullHTML(editor.document);
    createBlogPost(params?.slug, HTMLFromBlocks);
  };

  return (
    <div className="flex flex-col w-full justify-center items-center bg-editor-gray overflow-y-scroll overflow-x-hidden h-screen">
      <div className="flex flex-row w-screen gap-2 bg-gray-700 border-b-2 border-gray-800 px-8 sm:px-16 py-6 mb-10 rounded-lg align-top sticky top-0 place-content-end z-20">
        <Button className="bg-orange-800" size="lg">
          Save Draft
        </Button>
        <Button className=" bg-orange-500" size="lg" onClick={() => handleCreate()}>
          Create
        </Button>
      </div>
      {/* TODO Allow the user to add an image here as well? */}
      {/* <div className="w-screen h-3/6 absolute top-0">
        <Image
          src="/defaultBlogPhoto.jpg"
          alt="Cover image"
          objectFit="cover"
          fill={true}
        />
      </div> */}
      <div className="w-4/5 lg:w-2/5 rounded-lg">
        <BlockNoteView editor={editor} />
      </div>
    </div>
  );
}
