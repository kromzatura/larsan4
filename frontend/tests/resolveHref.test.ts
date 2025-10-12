import { describe, it, expect } from 'vitest';
import { resolveHref, resolveDocHref } from '@/lib/resolveHref';
import { DOC_TYPES, CATEGORY_DOC_TYPES } from '@/lib/docTypes';

describe('resolveHref', () => {
  it('returns null when docType missing', () => {
    expect(resolveHref(undefined, 'anything')).toBeNull();
  });

  it('resolves root home variants (default locale en)', () => {
    expect(resolveHref(DOC_TYPES.PAGE, undefined)).toBe('/en');
    expect(resolveHref(DOC_TYPES.PAGE, 'index')).toBe('/en');
    expect(resolveHref(DOC_TYPES.PAGE, 'home')).toBe('/en');
  });

  it('resolves generic pages (default locale en)', () => {
    expect(resolveHref(DOC_TYPES.PAGE, 'about')).toBe('/en/about');
    expect(resolveHref(DOC_TYPES.PAGE, '/nested/path')).toBe('/en/nested/path');
  });

  it('resolves blog posts (default locale en)', () => {
    expect(resolveHref(DOC_TYPES.POST, 'my-post')).toBe('/en/blog/my-post');
    expect(resolveHref(DOC_TYPES.POST, undefined)).toBeNull();
  });

  it('resolves product pages (default locale en)', () => {
    expect(resolveHref(DOC_TYPES.PRODUCT, 'widget')).toBe('/en/products/widget');
    expect(resolveHref(DOC_TYPES.PRODUCT, undefined)).toBeNull();
  });

  it('resolves product categories (default locale en)', () => {
    expect(resolveHref(DOC_TYPES.PRODUCT_CATEGORY, 'gadgets')).toBe('/en/products/category/gadgets');
    expect(resolveHref(DOC_TYPES.PRODUCT_CATEGORY, undefined)).toBeNull();
  });

  it('resolves blog categories (all variants, default locale en)', () => {
    for (const variant of CATEGORY_DOC_TYPES) {
      expect(resolveHref(variant, 'news')).toBe('/en/blog/category/news');
      expect(resolveHref(variant, undefined)).toBeNull();
    }
  });

  it('resolves contact page without slug (default locale en)', () => {
    expect(resolveHref(DOC_TYPES.CONTACT, undefined)).toBe('/en/contact');
    expect(resolveHref(DOC_TYPES.CONTACT, 'ignored')).toBe('/en/contact');
  });

  it('returns null for unknown doc types', () => {
    expect(resolveHref('unknownType', 'slug')).toBeNull();
  });
});

describe('resolveDocHref', () => {
  it('handles null/undefined', () => {
    expect(resolveDocHref(null)).toBeNull();
    expect(resolveDocHref(undefined)).toBeNull();
  });

  it('handles string slug field (default locale en)', () => {
    expect(resolveDocHref({ _type: DOC_TYPES.POST, slug: 'post-1' })).toBe('/en/blog/post-1');
  });

  it('handles slug object field (default locale en)', () => {
    expect(resolveDocHref({ _type: DOC_TYPES.PAGE, slug: { current: 'features' } })).toBe('/en/features');
  });

  it('returns null when slug missing and required', () => {
    expect(resolveDocHref({ _type: DOC_TYPES.POST })).toBeNull();
  });
});
