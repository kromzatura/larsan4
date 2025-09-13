import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";

// @sanity-typegen-ignore
export const pricing9Query = groq`
  _type == "pricing-9" => {
    _type,
    _key,
    padding,
    columns[]{
      _key,
      featured,
      title,
      description,
      price{
        monthly,
        yearly,
      },
      link{
        ${linkQuery},
      },
    },
    sections[]{
      _key,
      title,
      features[]{
        _key,
        name,
        tiers,
        tooltip,
      },
    },
  }
`;
