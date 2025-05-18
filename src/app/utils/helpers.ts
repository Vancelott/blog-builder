import { parse } from "node-html-parser";

export const findTitle = (html: string) => {
  const parsedHtml = parse(html);
  const h1 = parsedHtml.getElementsByTagName("h1")[0];

  return h1?.textContent?.trim() || "";
};
