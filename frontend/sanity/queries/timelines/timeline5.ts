import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const timeline5Query = groq`
  _type == "timeline-5" => {
    _type,
    _key,
    padding,
    title,
    description,
    columns[]{
      _key,
      iconVariant,
      title,
      description,
    },
  }
`;
