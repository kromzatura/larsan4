import { groq } from "next-sanity";
import { bodyQuery } from "../shared/body";

// @sanity-typegen-ignore
export const faq9Query = groq`
  _type == "faq-9" => {
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
