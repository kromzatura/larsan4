# Critical Bug: generatePageMetadata Translation URLs

**Date:** October 23, 2025  
**Severity:** 🔴 **HIGH** - Affects SEO (broken hreflang)  
**Status:** 🐛 **BUG CONFIRMED**

---

## Problem Summary

The `generatePageMetadata` function generates **INCORRECT hreflang alternate URLs** for translations because it doesn't account for the content type's URL structure.

### Example of the Bug

**For a product "Black Pepper" with Dutch translation "Zwarte Peper":**

**Current (WRONG):**
```html
<link rel="alternate" hreflang="en" href="https://example.com/en/products/black-pepper" />
<link rel="alternate" hreflang="nl" href="https://example.com/nl/zwarte-peper" />
<!-- ❌ WRONG! Missing /products/ prefix for Dutch -->
```

**Should be (CORRECT):**
```html
<link rel="alternate" hreflang="en" href="https://example.com/en/products/black-pepper" />
<link rel="alternate" hreflang="nl" href="https://example.com/nl/products/zwarte-peper" />
<!-- ✅ CORRECT! Includes /products/ prefix -->
```

---

## Root Cause Analysis

### 1. Translation Fragment Structure

**File:** `frontend/sanity/lib/queries/fragments.ts`

```typescript
export const TRANSLATIONS_QUERY_FRAGMENT = groq`
  "allTranslations": [...] {
    "lang": _key,
    "slug": value->slug.current  // ❌ Only the slug, not the full path
  }
`;
```

**Returns:**
```json
{
  "allTranslations": [
    { "lang": "en", "slug": "black-pepper" },
    { "lang": "nl", "slug": "zwarte-peper" }
  ]
}
```

### 2. Metadata Function Bug

**File:** `frontend/sanity/lib/metadata.ts` (Lines 88-95)

```typescript
// Add all available language alternates from data
for (const t of allTranslations) {
  const path = t.slug === "index" ? "/" : `/${t.slug}`;  // ❌ Just prepends /
  languageAlternates[t.lang] = buildCanonicalUrl(
    t.lang as SupportedLocale,
    path  // ❌ Builds: /nl/zwarte-peper instead of /nl/products/zwarte-peper
  );
```

### 3. How Pages Call It

**Products** (`products/[slug]/page.tsx`):
```typescript
generatePageMetadata({
  slug: `products/${params.slug}`,  // ✅ Current locale gets full path
  type: "product",                   // ℹ️ Type is available!
  locale,
})
```

**Blog Posts** (`blog/[slug]/page.tsx`):
```typescript
generatePageMetadata({
  slug: `blog/${params.slug}`,      // ✅ Current locale gets full path
  type: "post",                      // ℹ️ Type is available!
  locale,
})
```

### 4. The Mismatch

| Aspect | Current Locale | Translations |
|--------|---------------|--------------|
| **Canonical URL** | ✅ `products/black-pepper` | ❌ `zwarte-peper` |
| **Built URL** | ✅ `/en/products/black-pepper` | ❌ `/nl/zwarte-peper` |
| **Should be** | ✅ Correct | ❌ Should be `/nl/products/zwarte-peper` |

---

## Impact Assessment

### SEO Impact 🔴 HIGH

1. **Broken hreflang Links**
   - Search engines will see 404s for alternate language links
   - Hurts international SEO rankings
   - Google may not show correct language versions

2. **Duplicate Content Issues**
   - Search engines can't connect translations
   - May index wrong language for wrong region

3. **User Experience**
   - Locale switcher might send users to 404 pages
   - Poor international user experience

### Affected Content Types

- ✅ **Pages** - Actually works (uses document slug as full path)
- 🔴 **Products** - BROKEN (`/nl/peper` instead of `/nl/products/peper`)
- 🔴 **Product Categories** - BROKEN (`/nl/kruiden` instead of `/nl/products/category/kruiden`)
- 🔴 **Blog Posts** - BROKEN (`/nl/nieuws` instead of `/nl/blog/nieuws`)
- 🔴 **Blog Categories** - BROKEN (`/nl/updates` instead of `/nl/blog/category/updates`)

---

## Solution Design

### Option 1: Use `type` to Build Correct Path ✅ RECOMMENDED

**Pros:**
- Reuses existing `resolveHref` logic
- Type-safe
- Consistent with routing system
- Easy to maintain

**Implementation:**
```typescript
import { DOC_TYPES } from "@/lib/docTypes";

function buildPathForType(type: string, slug: string): string {
  switch (type) {
    case "post":
      return `/blog/${slug}`;
    case "product":
      return `/products/${slug}`;
    case "productCategory":
      return `/products/category/${slug}`;
    case "page":
      return slug === "index" ? "/" : `/${slug}`;
    default:
      return `/${slug}`;
  }
}

// In generatePageMetadata:
for (const t of allTranslations) {
  const path = buildPathForType(type, t.slug);
  languageAlternates[t.lang] = buildCanonicalUrl(
    t.lang as SupportedLocale,
    path
  );
}
```

### Option 2: Import and Use `resolveHref` ✅ EVEN BETTER

**Pros:**
- Single source of truth
- Automatically handles all document types
- Already tested and working

**Implementation:**
```typescript
import { resolveHref } from "@/lib/resolveHref";
import { DOC_TYPES } from "@/lib/docTypes";

// Map metadata type to docType
const typeToDocType = {
  "post": DOC_TYPES.POST,
  "product": DOC_TYPES.PRODUCT,
  "productCategory": DOC_TYPES.PRODUCT_CATEGORY,
  "page": DOC_TYPES.PAGE,
} as const;

// In generatePageMetadata:
for (const t of allTranslations) {
  const docType = typeToDocType[type] || DOC_TYPES.PAGE;
  const href = resolveHref(docType, t.slug, t.lang as SupportedLocale);
  if (href) {
    // resolveHref already includes locale, so we need the absolute URL
    languageAlternates[t.lang] = `${baseUrl}${href}`;
  }
}
```

### Option 3: Change Translation Fragment ❌ NOT RECOMMENDED

Store full path in translations - but this requires schema changes and is fragile.

---

## Recommended Fix: Option 2

Use `resolveHref` for consistency and single source of truth.

### Code Changes Required

**File:** `frontend/sanity/lib/metadata.ts`

1. Add imports:
```typescript
import { resolveHref } from "@/lib/resolveHref";
import { DOC_TYPES } from "@/lib/docTypes";
```

2. Add type mapping:
```typescript
const typeToDocType: Record<string, string> = {
  "post": DOC_TYPES.POST,
  "product": DOC_TYPES.PRODUCT,
  "productCategory": DOC_TYPES.PRODUCT_CATEGORY,
  "page": DOC_TYPES.PAGE,
};
```

3. Fix translation loop:
```typescript
// Build language alternates using resolveHref for consistency
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const docType = typeToDocType[type] || DOC_TYPES.PAGE;

for (const t of allTranslations) {
  const href = resolveHref(docType, t.slug, t.lang as SupportedLocale);
  if (href) {
    languageAlternates[t.lang] = `${baseUrl}${href}`;
  }
  
  // Build OpenGraph alternate locales
  if (t.lang !== locale) {
    const og = FORMAT_LOCALE_MAP[t.lang as SupportedLocale];
    if (og) ogAlternateLocales.push(og);
  }
}
```

---

## Testing Plan

### Unit Tests Needed

```typescript
describe('generatePageMetadata', () => {
  it('should generate correct hreflang for product translations', () => {
    const result = generatePageMetadata({
      page: {
        meta: { title: 'Black Pepper' },
        allTranslations: [
          { lang: 'en', slug: 'black-pepper' },
          { lang: 'nl', slug: 'zwarte-peper' },
        ],
      },
      slug: 'products/black-pepper',
      type: 'product',
      locale: 'en',
    });
    
    expect(result.alternates.languages.nl).toBe(
      'https://example.com/nl/products/zwarte-peper'
    );
  });
  
  it('should generate correct hreflang for blog post translations', () => {
    const result = generatePageMetadata({
      page: {
        meta: { title: 'News' },
        allTranslations: [
          { lang: 'en', slug: 'news' },
          { lang: 'nl', slug: 'nieuws' },
        ],
      },
      slug: 'blog/news',
      type: 'post',
      locale: 'en',
    });
    
    expect(result.alternates.languages.nl).toBe(
      'https://example.com/nl/blog/nieuws'
    );
  });
});
```

### Manual Testing Checklist

- [ ] Check product page HTML for correct hreflang URLs
- [ ] Check product category page HTML for correct hreflang URLs
- [ ] Check blog post page HTML for correct hreflang URLs
- [ ] Check blog category page HTML for correct hreflang URLs
- [ ] Verify locale switcher navigates to correct URLs
- [ ] Test with Google Search Console

---

## Priority & Timeline

**Priority:** 🔴 **P0 - Critical**  
**Estimated Fix Time:** 30 minutes  
**Testing Time:** 1 hour  
**Deploy:** ASAP after testing

---

## Conclusion

This is a **critical SEO bug** that breaks international search engine optimization. The fix is straightforward: use the existing `resolveHref` function to build correct paths for translations, ensuring consistency with the actual Next.js routing structure.

**Next Step:** Implement Option 2 fix immediately.
