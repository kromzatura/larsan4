import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";
import { imageQuery } from "../shared/image";

// @sanity-typegen-ignore
export const gallery4Query = groq`
  _type == "gallery-4" => {
    _type,
    _key,
    padding,
    title,
    description,
    columns[]{
      _key,
      title,
      description,
      image{
        ${imageQuery}
      },
      link{
        ${linkQuery},
      },
      categories[]->{
        _id,
        title,
        color
      },
    },
  }
`;
