// export const findTitle = (html: string) => {
//   const startTag = `<h1 class="bn-inline-content">`;
//   const startOfTitle = html.indexOf(startTag) + startTag.length;
//   const endOfTitle = html.indexOf("</h1>", startOfTitle);
//   const startOfPotentialTitle = html.substring(startOfTitle, endOfTitle).search("span");
//   const endOfPotentialTitle = html.substring(startOfTitle, endOfTitle).search("</span>");
//   // const title = potentialTitle.search("span")
//   let title = html.substring(startOfTitle, endOfTitle);
//   if (startOfPotentialTitle !== -1) {
//     title = html.substring(startOfPotentialTitle, endOfPotentialTitle);
//   }
//   // <h1 class="bn-inline-content"><span data-text-color="yellow">Title of your blog post</span></h1>

//   return title;
// };

export const findTitle = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const h1 = doc.getElementsByTagName("h1")[0];

  return h1?.textContent?.trim() || "";
};
