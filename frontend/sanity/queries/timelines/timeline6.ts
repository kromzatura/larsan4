import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const timeline6Query = groq`
  _type == "timeline-6" => {
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
