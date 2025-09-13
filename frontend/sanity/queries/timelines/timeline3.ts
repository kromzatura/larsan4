import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";
import { imageQuery } from "../shared/image";

// @sanity-typegen-ignore
export const timeline3Query = groq`
  _type == "timeline-3" => {
    _type,
    _key,
    padding,
    title,
    description,
    links[]{
      ${linkQuery},
    },
    columns[]{
      _key,
      title,
      description,
      image{
        ${imageQuery}
      },
    },
  }
`;
