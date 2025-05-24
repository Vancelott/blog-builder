import BlogPageEditor from "@/app/ui/blogPageEditor";
import AuthError from "@/app/ui/create/authError";
import { auth } from "@/app/auth";

export default async function CreatePage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex h-screen w-full bg-editor-gray place-items-center justify-center">
        <AuthError blogPost={false} />
      </div>
    );
  }

  return <BlogPageEditor edit={false} />;
}
