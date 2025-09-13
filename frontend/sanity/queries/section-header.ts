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
    tag,
    title,
    description,
    links[]{
      ${linkQuery}
    },
  }
`;
