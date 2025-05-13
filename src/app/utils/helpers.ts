export const findTitle = (html: string) => {
  const startTag = `<h1 class="bn-inline-content">`;
  const startOfTitle = html.indexOf(startTag) + startTag.length;
  const endOfTitle = html.indexOf("</h1>", startOfTitle);
  const title = html.substring(startOfTitle, endOfTitle);
  return title;
};
