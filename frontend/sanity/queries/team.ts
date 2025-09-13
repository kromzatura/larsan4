import { groq } from "next-sanity";
import { linkQuery } from "./shared/link";
import { imageQuery } from "./shared/image";

export const TEAM_QUERY = groq`*[_type == "team" && defined(slug)] | order(orderRank) {
    _id,
    name,
    title,
    description,
    slug,
    image{
      ${imageQuery}
    },
    links[]{
      ${linkQuery}
    },
}`;
