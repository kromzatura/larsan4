import { groq } from "next-sanity";
import { bodyQuery } from "../shared/body";

// @sanity-typegen-ignore
export const faq14Query = groq`
  _type == "faq-14" => {
    _type,
    _key,
    padding,
    title,
    description,
    sections[]{
      _type,
      _key,
      title,
      faqs[]->{
        _id,
        title,
        body[]{
          ${bodyQuery}
        }
      }
    }
  }
`;
