import { PropsWithChildren } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { PersonIcon } from "@radix-ui/react-icons";

interface IBlogPostData {
  img: string;
  createdAt: string;
  editedAt: string;
}

export default function BlogPostData(props: PropsWithChildren<IBlogPostData>) {
  return (
    <>
      <div className="flex flex-row-reverse sm:flex-row w-full sm:place-items-center sm:justify-between justify-start mb-4 sm:px-6 gap-6">
        <Avatar>
          <AvatarImage src={props.img} />
          <AvatarFallback>
            <PersonIcon style={{ color: "black" }} className="w-6 h-6" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col sm:justify-normal text-right">
          {props.createdAt ? (
            <p className="text-white text-md sm:text-lg">{props.createdAt}</p>
          ) : null}
          {props.editedAt ? (
            <p className="text-gray-300 text-sm">Edited: {props.editedAt}</p>
          ) : null}
        </div>
      </div>
      <Separator className="bg-gray-600" />
    </>
  );
}
