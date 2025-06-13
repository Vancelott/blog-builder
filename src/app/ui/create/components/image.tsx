"use client";

import React, { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";
import NextImage from "next/image";
import { ImageIcon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { RenderedDynamicElement } from "@/app/types/index";

export function Image(props: RenderedDynamicElement) {
  const [result, setResult] = useState([]);

  const { toast } = useToast();

  const { id, isDragOverlayRender, isStaticRender, input, handleInputChange } = props;

  const renderImage = (inputSrc?, result?) => {
    if (inputSrc || result.length > 0) {
      const img = inputSrc ? inputSrc : result[0].ufsUrl;
      return <NextImage src={img} alt="" fill />;
    }

    return (
      <div className="h-full w-full bg-gray-700 flex justify-center place-items-center">
        <ImageIcon
          className="text-gray-300"
          style={{
            display: "inline-block",
            transform: `scale(2)`,
          }}
        />
      </div>
    );
  };

  if (isDragOverlayRender || isStaticRender) {
    return (
      <div className="flex flex-col justify-between w-full h-full">
        {renderImage(input)}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between w-full h-full">
      {renderImage("", result)}
      <UploadButton
        className="absolute place-self-end bottom-0 bg-gray-300 p-1 rounded-t-xl"
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          setResult(res);
          handleInputChange(id, res[0].ufsUrl);
        }}
        onUploadError={(error: Error) => {
          toast({
            title: "Something went wrong.",
            description: "The image could not be uploaded, please try again.",
            className: "bg-yellow-100 border-yellow-300 m-2",
          });
          console.log(`Image upload failed: ${error.message}`);
        }}
      />
    </div>
  );
}
