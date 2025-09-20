export const linkQuery = `
    _key,
    ...,
    "href": select(
      isExternal => href,
      @.internalLink->slug.current == "index" => "/",
      @.internalLink->_type == "post" => "/blog/" + @.internalLink->slug.current,
      @.internalLink->_type == "blogCategory" => "/blog/category/" + @.internalLink->slug.current,
      @.internalLink->_type == "postCategory" => "/blog/category/" + @.internalLink->slug.current,
      @.internalLink->_type == "product" => "/products/" + @.internalLink->slug.current,
      @.internalLink->_type == "productCategory" => "/products/category/" + @.internalLink->slug.current,
      @.internalLink->_type == "contact" => "/contact",
      "/" + @.internalLink->slug.current
    )
`;
