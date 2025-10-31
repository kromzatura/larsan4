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
    richDescription[]{
      ...,
      markDefs[]{
        ...,
        _type == "link" => {
          ${linkQuery}
        }
      }
    },
    isDatasheetTitle,
    hasGroupDivider,
    links[]{
      ${linkQuery}
    },
  }
`;
