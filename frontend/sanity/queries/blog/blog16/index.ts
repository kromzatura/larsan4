import { groq } from "next-sanity";
import { imageQuery } from "../../shared/image";

// @sanity-typegen-ignore
export const blog16Query = groq`
  _type == "blog-16" => {
    _type,
    _key,
    padding,
    posts[]->{
      _id,
      _createdAt,
      title,
      slug,
      categories[]->{
        _id,
        title,
      },
      author->{
        _id,
        name,
        title,
        image{
          ${imageQuery}
        }
      }
    },
  }
`;
