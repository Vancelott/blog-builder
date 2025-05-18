"use client";

import { getBlogPost } from "@/app/lib/data";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import "@blocknote/shadcn/style.css";
import BlogPostData from "@/app/ui/slug/blogPostData";

export default function Page() {
  const params = useParams<string>();
  const [post, setPost] = useState({});

  useEffect(() => {
    let isDataFetched = false;

    const fetchPageData = async () => {
      if (params) {
        try {
          const data = await getBlogPost(params.post);
          if (!isDataFetched) {
            setPost(data);
          }
        } catch (error) {
          if (!isDataFetched) {
            console.error("Failed to fetch data", error);
          }
        }
      }
    };

    fetchPageData();
    return () => {
      isDataFetched = true;
    };
  }, [params]);

  return (
    <div className="flex flex-col w-full justify-center items-center bg-editor-gray overflow-y-scroll overflow-x-hidden h-screen pt-52 pb-32">
      {/* TODO consider adding a button to go back */}
      {/* <button className="rounded-full p-4 bg-slate-600 text-white absolute top-0 left-0 m-6">
        Back
      </button> */}
      <div className="w-4/5 lg:w-2/5 rounded-lg">
        <BlogPostData
          img=""
          createdAt={post?.created_at?.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          editedAt={post?.edited_at?.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        />
        {/* TODO update this when you've added dark/light mode. Maybe use `BlockNoteView` in order to utilize `theme` */}
        <div className="bn-container dark bn-shadcn" data-color-scheme="dark">
          <div
            className="bn-default-styles"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </div>
    </div>
  );
}
