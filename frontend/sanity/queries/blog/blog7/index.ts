import { groq } from "next-sanity";
import { imageQuery } from "../../shared/image";

// @sanity-typegen-ignore
export const blog7Query = groq`
  _type == "blog-7" => {
    _type,
    _key,
    padding,
    gridColumns,
    posts[]->{
      _id,
      _createdAt,
      title,
      slug,
      excerpt,
      image{
        ${imageQuery}
      },
    },
  }
`;
