export const imageQuery = `
  ...,
  // Ensure custom fields like alt are present alongside asset
  alt,
  asset->{
    _id,
    url,
    mimeType,
    metadata {
      lqip,
      dimensions {
        width,
        height
      }
    }
  }
`;
