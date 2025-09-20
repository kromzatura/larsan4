// Shared content/domain types extracted to eliminate 'any' usage in feeds, pages, and comparison logic.
// These types intentionally mirror the GROQ projections currently used so we can progressively tighten them.

export type SanitySlug = { current?: string | null } | null | undefined;

export interface FeedPostImageMetaDimensions {
  width?: number | null;
  height?: number | null;
}

export interface FeedPostImageMeta {
  dimensions?: FeedPostImageMetaDimensions | null;
}

export interface FeedPostImageAsset {
  url?: string | null;
  mimeType?: string | null;
  metadata?: FeedPostImageMeta | null;
}

export interface FeedPostImage {
  asset?: FeedPostImageAsset | null;
  alt?: string | null;
}

export interface FeedPostCategory {
  title?: string | null;
  slug?: SanitySlug;
  _id?: string | null;
}

export interface FeedPostAuthor {
  name?: string | null;
  title?: string | null;
  imageUrl?: string | null; // Normalized for list rendering
}

export interface FeedPost {
  _id?: string;
  title?: string | null;
  slug?: { current?: string | null } | null;
  excerpt?: string | null;
  body?: unknown[] | null; // Portable Text blocks
  publishedAt?: string | null;
  _createdAt?: string | null;
  author?: FeedPostAuthor | null;
  image?: FeedPostImage | null;
  categories?: FeedPostCategory[] | null;
}

// Product domain types
export interface ProductSpecification {
  sku?: string | null;
  hsCode?: string | null;
  minOrder?: string | number | null;
  origin?: string | null;
  botanicalName?: string | null;
  bestFor?: string | null;
  pungency?: string | number | null;
  bindingCapacity?: string | number | null;
  fatContent?: number | null;
  moisture?: string | number | null;
  shelfLife?: string | null;
  allergenInfo?: string | null;
  productAttributes?: string | null;
  certification?: string | null;
  purity?: string | null;
}

export interface ProductCategoryRef {
  _id?: string | null;
  title?: string | null;
  slug?: { current?: string | null } | null;
}

export interface ProductDocument {
  _id?: string;
  title?: string | null;
  slug?: { current?: string | null } | null;
  excerpt?: string | null;
  body?: unknown[] | null;
  image?: {
    asset?: {
      _id?: string | null;
      url?: string | null;
      metadata?: { lqip?: string | null; dimensions?: { width?: number | null; height?: number | null } | null } | null;
    } | null;
    alt?: string | null;
  } | null;
  keyFeatures?: string[] | null;
  packagingOptions?: Array<{
    packagingType?: string | null;
    sizeValue?: string | number | null;
    sizeUnit?: string | null;
    weightPerPallet?: string | null;
    notes?: string | null;
  }> | null;
  categories?: ProductCategoryRef[] | null;
  specifications?: ProductSpecification[] | null;
}

// Utility type helpers
export function firstSpec(specs: ProductSpecification[] | null | undefined): ProductSpecification | undefined {
  return Array.isArray(specs) && specs.length > 0 ? specs[0] : undefined;
}
