// import { useSearchParams } from "next/navigation";
import { getPage } from "@/app/lib/data";
import { DynamicElement } from "@/app/ui/create/dynamicElement";

export default async function Page({ params }: { params }) {
  // const searchParams = useSearchParams();
  // const page = searchParams.get("p");

  const { slug } = await params;
  const pageData = await getPage(slug);

  return (
    <div className="flex flex-row h-screen w-full relative">
      {await pageData.map((item, index) => {
        const itemPosition = item.position;
        // const left = Math.round(item.position.left);
        // const right = Math.round(item.position.right);
        const left = item.position.left;
        const right = item.position.right;
        return (
          <div
            className={`left-${left}px right-${right}px relative`}
            style={{
              left: `${left}px`,
              right: `${right}px`,
            }}
            key={item.id}
          >
            <DynamicElement
              tag={item.tag}
              id={item.id}
              element={item}
              gridId={item.gridId}
              className2={{ left: left, right: right }}
              // className2={`left-${left}px right-${right}px`}
              // TODO match the items with the current item.id (same for the /create page)
              childElements={pageData
                .filter((items) => items.gridId !== null)
                .flatMap((item) => item.otherElements || [])}
            />
            <p>{item.position.left}</p>
            <p>{item.position.right}</p>
          </div>
        );
      })}
    </div>
  );
}
