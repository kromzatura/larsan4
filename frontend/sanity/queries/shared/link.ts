export const linkQuery = `
  _key,
  ...,
  // Internal link metadata for runtime href resolution (external links keep provided href)
  "internalType": internalLink->_type,
  "internalSlug": internalLink->slug.current,
  // Preserve original href only for explicit external links; internal href resolved in app code
  "href": select(isExternal => href, null)
`;
