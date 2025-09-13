import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";
import { bodyQuery } from "./shared/body";

export const CHANGELOGS_QUERY = groq`*[_type == "changelog" && defined(slug)] | order(date desc){
    _id,
    title,
    slug,
    version,
    date,
    body[]{
      ${bodyQuery}
    },
    image{
      ${imageQuery}
    },
    author->{
      name,
      title,
      image {
        ${imageQuery}
      }
    },
    categories[]->{
      _id,
      title,
      color
    },
}`;
