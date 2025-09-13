import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const compare6Query = groq`
  _type == "compare-6" => {
    _type,
    _key,
    padding,
    title,
    rows,
    columns[]{
      _key,
      name,
      attributes[]{
        _key,
        value,
        status,
      },
    },
  }
`;
