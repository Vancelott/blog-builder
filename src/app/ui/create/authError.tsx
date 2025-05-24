import { Button } from "@/components/ui/button";
import { LockClosedIcon } from "@radix-ui/react-icons";

export default function AuthError(props?: boolean) {
  return (
    <div className="flex flex-col w-full h-full justify-center place-items-center gap-6">
      <div className="flex gap-14 place-items-center">
        <LockClosedIcon
          className="text-orange-700"
          style={{
            display: "inline-block",
            transform: `scale(4.5)`,
          }}
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl text-gray-100">You need to log in to continue</h1>
          <h2 className="text-lg text-gray-200">
            {props.blogPost
              ? "To edit your blog post, please log in first."
              : "To edit your blog, please log in first."}
          </h2>
        </div>
      </div>
      <div className="flex gap-4">
        <Button className="bg-transparent border-2 border-gray-300">Back</Button>
        <Button className="bg-orange-600 hover:bg-orange-400">Log in</Button>
      </div>
    </div>
  );
}
