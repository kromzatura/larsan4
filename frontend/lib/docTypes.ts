export const DOC_TYPES = {
  PAGE: "page",
  POST: "post",
  BLOG_CATEGORY: "blogCategory",
  POST_CATEGORY: "postCategory", // legacy / alias
  CATEGORY: "category", // legacy generic blog category
  PRODUCT: "product",
  PRODUCT_CATEGORY: "productCategory",
  CONTACT: "contact",
} as const;

export type DocType = typeof DOC_TYPES[keyof typeof DOC_TYPES];

// Helper set for category variants
export const CATEGORY_DOC_TYPES: DocType[] = [
  DOC_TYPES.BLOG_CATEGORY,
  DOC_TYPES.POST_CATEGORY,
  DOC_TYPES.CATEGORY,
];
