import { groq } from "next-sanity";
import { linkQuery } from "./shared/link";
import { metaQuery } from "./shared/meta";

export const CONTACT_QUERY = groq`*[_type == "contact"][0]{
  tagline,
  title,
  description,
  contactMethods[]{
    icon,
    title,
    description,
    link {
      ${linkQuery}
    }
  },
  ${metaQuery},
}`;
