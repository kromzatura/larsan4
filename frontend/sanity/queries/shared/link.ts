export const linkQuery = `
    _key,
    ...,
    // Internal link metadata for runtime href resolution
    "internalType": internalLink->_type,
    "internalSlug": internalLink->slug.current,
    // Existing GROQ-computed href (will be overridden in code if internalType present)
    "href": select(
      isExternal => href,
      @.internalLink->slug.current == "index" => "/",
      @.internalLink->_type == "post" => "/blog/" + @.internalLink->slug.current,
    @.internalLink->_type in ["blogCategory","postCategory","category"] => "/blog/category/" + @.internalLink->slug.current,
      @.internalLink->_type == "product" => "/products/" + @.internalLink->slug.current,
      @.internalLink->_type == "productCategory" => "/products/category/" + @.internalLink->slug.current,
      @.internalLink->_type == "contact" => "/contact",
      "/" + @.internalLink->slug.current
    )
`;
