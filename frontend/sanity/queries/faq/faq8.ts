import { groq } from "next-sanity";
import { bodyQuery } from "../shared/body";

// @sanity-typegen-ignore
export const faq8Query = groq`
  _type == "faq-8" => {
    _type,
    _key,
    padding,
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
