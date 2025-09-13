import { groq } from "next-sanity";
import { linkQuery } from "../../shared/link";

// @sanity-typegen-ignore
export const changelog5Query = groq`
  _type == "changelog-5" => {
    _type,
    _key,
    padding,
    title,
    secondaryTitle,
    links[]{
      ${linkQuery}
    },
  }
`;
