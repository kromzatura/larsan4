import { groq } from 'next-sanity';

// Fragment for productPricing object. Expect to be embedded as: pricing{ ${productPricingFragment} }
export const productPricingFragment = groq`
  _type,
  currency,
  tiers[]{
    _key,
    _type,
    slug,
    title,
    description,
    monthly,
    yearly,
    features[]
  }
`;
