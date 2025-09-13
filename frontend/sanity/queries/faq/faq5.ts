import { groq } from "next-sanity";
import { bodyQuery } from "../shared/body";

// @sanity-typegen-ignore
export const faq5Query = groq`
  _type == "faq-5" => {
    _type,
    _key,
    padding,
    faqs[]->{
      _id,
      title,
      body[]{
        ${bodyQuery}
      },
    },
  }
`;
