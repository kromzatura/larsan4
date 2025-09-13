import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";
import { imageQuery } from "../shared/image";

// @sanity-typegen-ignore
export const gallery1Query = groq`
  _type == "gallery-1" => {
    _type,
    _key,
    padding,
    columns[]{
      _key,
      title,
      image{
        ${imageQuery}
      },
      logo{
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
