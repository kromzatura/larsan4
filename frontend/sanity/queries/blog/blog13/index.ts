import { groq } from "next-sanity";
import { imageQuery } from "../../shared/image";

// @sanity-typegen-ignore
export const blog13Query = groq`
  _type == "blog-13" => {
    _type,
    _key,
    padding,
    gridColumns,
    posts[]->{
      _id,
      _createdAt,
      title,
      slug,
      image{
        ${imageQuery}
      },
      categories[]->{
        _id,
        title,
      },
    },
  }
`;
