import { describe, it, expect } from 'vitest';
import { resolveHref, resolveDocHref } from '@/lib/resolveHref';
import { DOC_TYPES, CATEGORY_DOC_TYPES } from '@/lib/docTypes';

describe('resolveHref', () => {
  it('returns null when docType missing', () => {
    expect(resolveHref(undefined, 'anything')).toBeNull();
  });

  it('resolves root home variants', () => {
    expect(resolveHref(DOC_TYPES.PAGE, undefined)).toBe('/');
    expect(resolveHref(DOC_TYPES.PAGE, 'index')).toBe('/');
    expect(resolveHref(DOC_TYPES.PAGE, 'home')).toBe('/');
  });

  it('resolves generic pages', () => {
    expect(resolveHref(DOC_TYPES.PAGE, 'about')).toBe('/about');
    expect(resolveHref(DOC_TYPES.PAGE, '/nested/path')).toBe('/nested/path');
  });

  it('resolves blog posts', () => {
    expect(resolveHref(DOC_TYPES.POST, 'my-post')).toBe('/blog/my-post');
    expect(resolveHref(DOC_TYPES.POST, undefined)).toBeNull();
  });

  it('resolves product pages', () => {
    expect(resolveHref(DOC_TYPES.PRODUCT, 'widget')).toBe('/products/widget');
    expect(resolveHref(DOC_TYPES.PRODUCT, undefined)).toBeNull();
  });

  it('resolves product categories', () => {
    expect(resolveHref(DOC_TYPES.PRODUCT_CATEGORY, 'gadgets')).toBe('/products/category/gadgets');
    expect(resolveHref(DOC_TYPES.PRODUCT_CATEGORY, undefined)).toBeNull();
  });

  it('resolves blog categories (all variants)', () => {
    for (const variant of CATEGORY_DOC_TYPES) {
      expect(resolveHref(variant, 'news')).toBe('/blog/category/news');
      expect(resolveHref(variant, undefined)).toBeNull();
    }
  });

  it('resolves contact page without slug', () => {
    expect(resolveHref(DOC_TYPES.CONTACT, undefined)).toBe('/contact');
    expect(resolveHref(DOC_TYPES.CONTACT, 'ignored')).toBe('/contact');
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

  it('handles string slug field', () => {
    expect(resolveDocHref({ _type: DOC_TYPES.POST, slug: 'post-1' })).toBe('/blog/post-1');
  });

  it('handles slug object field', () => {
    expect(resolveDocHref({ _type: DOC_TYPES.PAGE, slug: { current: 'features' } })).toBe('/features');
  });

  it('returns null when slug missing and required', () => {
    expect(resolveDocHref({ _type: DOC_TYPES.POST })).toBeNull();
  });
});
