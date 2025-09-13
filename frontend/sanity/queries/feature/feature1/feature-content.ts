import { groq } from "next-sanity";
import { linkQuery } from "../../shared/link";
import { bodyQuery } from "../../shared/body";

// @sanity-typegen-ignore
export const featureContentQuery = groq`
  _type == "feature-content" => {
    _type,
    _key,
    padding,
    iconVariant,
    tag,
    title,
    body[]{
      ${bodyQuery}
    },
    links[]{
      ${linkQuery}
    },
  }
`;
