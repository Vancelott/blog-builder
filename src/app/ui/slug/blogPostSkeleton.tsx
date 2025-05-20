import { Skeleton } from "@/components/ui/skeleton";

interface IBlogPostSkeleton {
  edit: boolean;
  userData: boolean;
}

export default function BlogPostSkeleton(props: IBlogPostSkeleton) {
  const { edit, userData } = props;

  // TODO update bg when switching themes
  return (
    <div
      className={`flex flex-col w-full justify-center items-center bg-editor-gray min-h-screen gap-8 overflow-x-hidden ${
        edit ? "pb-10" : "py-10"
      }`}
    >
      {/* Edit bar */}
      {edit ? (
        <Skeleton className="flex flex-row w-screen gap-2 bg-gray-800 border-b-2 border-gray-700 px-8 sm:px-16 py-6 mb-10 rounded-lg align-top sticky top-0 place-content-end">
          <Skeleton className="w-28 h-10 bg-gray-700" />
        </Skeleton>
      ) : null}
      <div className="w-4/5 lg:w-2/5 rounded-lg">
        {/* Avatar and dates */}
        {userData ? (
          <div className="flex flex-row-reverse sm:flex-row w-full sm:place-items-center sm:justify-between justify-start mb-8 sm:px-6 gap-6">
            <Skeleton className="w-11 h-11 bg-gray-700 rounded-full" />
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="w-20 h-4 bg-gray-700" />
              <Skeleton className="w-16 h-4 bg-gray-700" />
            </div>
          </div>
        ) : null}
        {/* Title and main image */}
        <Skeleton className="w-4/5 h-16 bg-gray-700 mb-10" />
        <Skeleton className="w-full h-96 mb-20 bg-gray-700" />
        <div className="space-y-8">
          {/* Paragraphs */}
          <Skeleton className="w-full h-40 bg-gray-700" />
          <Skeleton className="w-full h-48 bg-gray-700" />
        </div>
      </div>
    </div>
  );
}
