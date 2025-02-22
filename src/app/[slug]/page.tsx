// import { useSearchParams } from "next/navigation";
import { getPage } from "@/app/lib/data";
import { DynamicElement } from "@/app/ui/create/dynamicElement";

export default async function Page({ params }: { params }) {
  // const searchParams = useSearchParams();
  // const page = searchParams.get("p");

  const { slug } = await params;
  const pageData = await getPage(slug);

  return (
    <div className="flex flex-row h-screen w-full">
      {await pageData.map((item, index) => (
        <div key={index} className="flex flex-col justify-center">
          <DynamicElement tag={item.tag} />
        </div>
      ))}
    </div>
  );
}
