"use client";

import { getPage } from "@/app/lib/data";
import { DynamicElement } from "@/app/ui/create/dynamicElement";
import { useWindowSize } from "@uidotdev/usehooks";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { SlugPageData } from "@/app/types/index";

export default function Page() {
  const params = useParams<string>();
  const [pageData, setPageData] = useState<SlugPageData>({
    data: null,
    otherData: null,
  });
  const mainGridRef = useRef(null);
  const screenSize = useWindowSize();

  useEffect(() => {
    let isDataFetched = false;

    const fetchPageData = async () => {
      if (params) {
        try {
          const data = await getPage(params.slug);
          if (!isDataFetched) {
            setPageData(data);
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

  if (!pageData.data) {
    return <p>Loading</p>;
  }

  if (screenSize.width < 700) {
    return (
      <div className="flex flex-col h-screen w-full relative overflow-hidden bg-black ">
        {/* <div>
          {pageData?.data
            .filter((component) => component.dnd === "Droppable")
            .map((item, index) => {
              return (
                <div
                  // className={`${item.positionClass} absolute z-20`}
                  className={`absolute z-20`}
                  style={{
                    // transform: `translate3d(${item.position.x}px, ${item.position.y}px, 0)`,
                    // top: `${top}px`,
                    // left: `${left}px`,
                    width: item.size.width,
                    height: item.size.height,
                  }}
                  key={item.id}
                >
                  <DynamicElement
                    element={item}
                    // handleInputChange={handleInputChange}
                    // handlePositionChange={handlePositionChange}
                    // previewMode={previewMode}
                    input={item.input}
                    childElements={pageData.data.filter(
                      (items) => items.parentId === item.id
                    )}
                    tag={item.tag}
                    id={item.id}
                  />
                </div>
              );
            })}
        </div> */}
        {/* // TODO the applied margin has to reach this point */}
        <div className="flex flex-col justify-center place-items-center m-8">
          {pageData?.data
            .filter(
              (component) => component.parentId === null && component.dnd !== "Droppable"
            )
            .map((item, index) => {
              return (
                <div
                  // className="absolute"
                  // style={{
                  //   transform: `translate3d(${item.position.x}px, ${item.position.y}px, 0)`,
                  //   // top: `${top}px`,
                  //   // left: `${left}px`,
                  //   width: item.size.width,
                  //   height: item.size.height,
                  // }}
                  key={item.id}
                >
                  <DynamicElement
                    element={item}
                    // handleInputChange={handleInputChange}
                    // handlePositionChange={handlePositionChange}
                    // previewMode={previewMode}
                    input={item.input}
                    tag={item.tag}
                    id={item.id}
                    // isSlugRender={true}
                  />
                </div>
              );
            })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden">
      {pageData?.data
        .filter((component) => component.dnd === "Droppable")
        .map((item, index) => {
          return (
            // <div
            //   // className={`${item.positionClass} absolute z-20`}
            //   className={`z-20`}
            //   style={{
            //     // transform: `translate3d(${item.position.x}px, ${item.position.y}px, 0)`,
            //     // top: `${top}px`,
            //     // left: `${left}px`,
            //     width: item.size.width,
            //     height: item.size.height,
            //   }}
            //   key={item.id}
            // >
            <DynamicElement
              key={item.id}
              element={item}
              // handleInputChange={handleInputChange}
              // handlePositionChange={handlePositionChange}
              // previewMode={previewMode}
              input={item.input}
              childElements={pageData.data.filter((items) => items.parentId === item.id)}
              tag={item.tag}
              id={item.id}
            />
            // </div>
          );
        })}
      {/* // TODO the applied margin has to reach this point */}
      <div
        // className="flex-1 grow relative min-w-0 min-h-0"
        ref={mainGridRef}
        style={{
          marginTop: `${pageData.otherData?.parentMargin.marginTop || 0}px`,
          marginLeft: `${pageData.otherData?.parentMargin.marginLeft || 0}px`,
          marginRight: `${pageData.otherData?.parentMargin.marginRight || 0}px`,
          marginBottom: `${pageData.otherData?.parentMargin.marginBottom || 0}px`,
          width: `calc(100vw - ${
            (pageData.otherData?.parentMargin.marginLeft || 0) +
            (pageData.otherData?.parentMargin.marginRight || 0)
          }px)`,
          height: `calc(100vh - ${
            (pageData.otherData?.parentMargin.marginTop || 0) +
            (pageData.otherData?.parentMargin.marginBottom || 0)
          }px)`,
        }}
      >
        {pageData?.data
          .filter(
            (component) => component.parentId === null && component.dnd !== "Droppable"
          )
          .map((item, index) => {
            return (
              <div
                // className="absolute"
                // style={{
                //   transform: `translate3d(${
                //     // position.x + screenSize?.deltaX < 0 || position.x < screenSize.width
                //     item.position.x + screenSize?.deltaX < 0 ||
                //     item.position.x + screenSize.deltaX <
                //       screenSize.width -
                //         (pageData.otherData?.parentMargin.marginLeft +
                //           pageData.otherData?.parentMargin.marginRight)
                //       ? 0
                //       : item.position.x + screenSize?.deltaX
                //   }px, ${
                //     item.position.y + screenSize?.deltaY < 0
                //       ? 0
                //       : item.position.y + screenSize?.deltaY
                //   }px, 0)`,
                // }}
                key={item.id}
              >
                <DynamicElement
                  element={item}
                  // handleInputChange={handleInputChange}
                  // handlePositionChange={handlePositionChange}
                  // previewMode={previewMode}
                  input={item.input}
                  tag={item.tag}
                  id={item.id}
                  mainGridRef={mainGridRef ? mainGridRef : null}
                  shouldAdjustPosition={true}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
