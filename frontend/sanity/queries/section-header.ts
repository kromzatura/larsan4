import { groq } from "next-sanity";
import { linkQuery } from "./shared/link";
// @sanity-typegen-ignore
export const sectionHeaderQuery = groq`
  _type == "section-header" => {
    _type,
    _key,
    padding,
    sectionWidth,
    stackAlign,
    direction,
  surface,
    tag,
    title,
    description,
    isDatasheetTitle,
    hasGroupDivider,
    links[]{
      ${linkQuery}
    },
  }
`;
