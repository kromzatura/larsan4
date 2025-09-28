import { groq } from 'next-sanity';

/**
 * Image fragment (rollback version) using single-document alt text.
 * If multi-locale object is reintroduced later, this fragment can be extended again.
 */
export const imageFragment = groq`
  {
    _type,
    asset->{
      _id,
      url,
      metadata {
        dimensions { aspectRatio, width, height },
        lqip,
        palette { dominant { background foreground } }
      }
    },
    alt
  }
`;
