# Locale Switcher Translation Support Audit

**Date:** October 23, 2025  
**Status:** 🔴 Critical Issue Identified  
**Branch:** seo-start

## Executive Summary

All page types have complete translation infrastructure (queries, providers, routing), but **locale switching fails in production** due to an architectural mismatch: the `LocaleSwitcher` component is rendered at the layout level where it cannot access the `PageTranslationProvider` context from individual pages.

## Audit Results by Page Type

### 1. Blog Post Pages ✅/❌

**File:** `frontend/app/[lang]/(main)/blog/[slug]/page.tsx`

| Component               | Status             | Details                                                       |
| ----------------------- | ------------------ | ------------------------------------------------------------- |
| GROQ Query              | ✅ **Complete**    | Uses `TRANSLATIONS_QUERY_FRAGMENT` to fetch `allTranslations` |
| PageTranslationProvider | ✅ **Implemented** | Lines 185-188, wraps content with filtered translations       |
| Doc Type                | ✅ **Correct**     | Uses `DOC_TYPES.POST`                                         |
| resolveHref Support     | ✅ **Works**       | Maps to `/blog/${slug}`                                       |
| **Locale Switching**    | ❌ **FAILS**       | Context not accessible to header switcher                     |

**Code Evidence:**

```tsx
// Line 182: Filters translations
const translations = post.allTranslations?.filter(
  (t): t is { lang: string; slug: string } => !!t?.slug
);

// Lines 185-188: Wraps in provider
return (
  <PageTranslationProvider
    allTranslations={translations}
    docType={DOC_TYPES.POST}
  >
```

**Expected Behavior:**

- `/nl/blog/welkom` → click EN → `/en/blog/welcome`

**Actual Behavior:**

- `/nl/blog/welkom` → click EN → `/en/blog/welkom` (404)

---

### 2. Blog Category Pages ✅/❌

**File:** `frontend/app/[lang]/(main)/blog/category/[slug]/page.tsx`

| Component               | Status             | Details                                                      |
| ----------------------- | ------------------ | ------------------------------------------------------------ |
| GROQ Query              | ✅ **Complete**    | Uses `TRANSLATIONS_QUERY_FRAGMENT` in `blogCategory.ts`      |
| PageTranslationProvider | ✅ **Implemented** | Lines 170-173, wraps content with filtered translations      |
| Doc Type                | ✅ **Correct**     | Uses `DOC_TYPES.CATEGORY` (included in `CATEGORY_DOC_TYPES`) |
| resolveHref Support     | ✅ **Works**       | Maps to `/blog/category/${slug}` via `CATEGORY_DOC_TYPES`    |
| **Locale Switching**    | ❌ **FAILS**       | Context not accessible to header switcher                    |

**Code Evidence:**

```tsx
// Lines 166-168: Filters translations
const translations = cat.allTranslations?.filter(
  (t): t is { lang: string; slug: string } => !!t?.slug
);

// Lines 170-173: Wraps in provider
return (
  <PageTranslationProvider
    allTranslations={translations}
    docType={DOC_TYPES.CATEGORY}
  >
```

**Expected Behavior:**

- `/nl/blog/category/nieuws` → click EN → `/en/blog/category/news`

**Actual Behavior:**

- `/nl/blog/category/nieuws` → click EN → `/en/blog/category/nieuws` (404)

---

### 3. Product Pages ✅/❌

**File:** `frontend/app/[lang]/(main)/products/[slug]/page.tsx`

| Component               | Status             | Details                                                          |
| ----------------------- | ------------------ | ---------------------------------------------------------------- |
| GROQ Query              | ✅ **Complete**    | `PRODUCT_QUERY` includes `TRANSLATIONS_QUERY_FRAGMENT` (line 92) |
| PageTranslationProvider | ✅ **Implemented** | Lines 228-231, wraps content with filtered translations          |
| Doc Type                | ✅ **Correct**     | Uses `DOC_TYPES.PRODUCT`                                         |
| resolveHref Support     | ✅ **Works**       | Maps to `/products/${slug}`                                      |
| **Locale Switching**    | ❌ **FAILS**       | Context not accessible to header switcher                        |

**Code Evidence:**

```tsx
// Lines 224-226: Filters translations
const translations = product.allTranslations?.filter(
  (t): t is { lang: string; slug: string } => !!t?.slug
);

// Lines 228-231: Wraps in provider
return (
  <PageTranslationProvider
    allTranslations={translations}
    docType={DOC_TYPES.PRODUCT}
  >
```

**Real Production Example:**

- **Dutch:** https://largseeds.nl/nl/products/gepelde-gierstzaden
- **Expected EN:** https://largseeds.nl/en/products/hulled-millet-seeds
- **Actual EN:** https://largseeds.nl/en/products/gepelde-gierstzaden ❌ (404)

---

### 4. Product Category Pages ✅/❌

**File:** `frontend/app/[lang]/(main)/products/category/[slug]/page.tsx`

| Component               | Status             | Details                                                                 |
| ----------------------- | ------------------ | ----------------------------------------------------------------------- |
| GROQ Query              | ✅ **Complete**    | `PRODUCT_CATEGORY_BY_SLUG_QUERY` includes `TRANSLATIONS_QUERY_FRAGMENT` |
| PageTranslationProvider | ✅ **Implemented** | Lines 135-138, wraps content with filtered translations                 |
| Doc Type                | ✅ **Correct**     | Uses `DOC_TYPES.PRODUCT_CATEGORY`                                       |
| resolveHref Support     | ✅ **Works**       | Maps to `/products/category/${slug}`                                    |
| **Locale Switching**    | ❌ **FAILS**       | Context not accessible to header switcher                               |

**Code Evidence:**

```tsx
// Lines 131-133: Filters translations
const translations = cat.allTranslations?.filter(
  (t): t is { lang: string; slug: string } => !!t?.slug
);

// Lines 135-138: Wraps in provider
return (
  <PageTranslationProvider
    allTranslations={translations}
    docType={DOC_TYPES.PRODUCT_CATEGORY}
  >
```

**Real Production Example:**

- **Dutch:** https://largseeds.nl/nl/products/category/oliehoudende-zaden
- **Expected EN:** https://largseeds.nl/en/products/category/oilseeds
- **Actual EN:** https://largseeds.nl/en/products/category/oliehoudende-zaden ❌ (404)

**Note:** User indicated product category slugs are identical across languages, so this specific case would work with simple path swap, but the infrastructure was built for translation-aware routing.

---

## Root Cause Analysis

### The Architectural Mismatch

```
┌─────────────────────────────────────────────────┐
│ Layout Level (app/[lang]/layout.tsx)           │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ Header (MainLayoutShell → navbar-1.tsx)   │ │
│  │                                           │ │
│  │  ┌─────────────────────────────────────┐ │ │
│  │  │ LocaleSwitcher Component            │ │ │
│  │  │                                     │ │ │
│  │  │ const { allTranslations } =         │ │ │
│  │  │   useTranslations(); ❌ undefined   │ │ │
│  │  │                                     │ │ │
│  │  └─────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ {children} - Page Component               │ │
│  │                                           │ │
│  │  ┌─────────────────────────────────────┐ │ │
│  │  │ <PageTranslationProvider           │ │ │
│  │  │   allTranslations={translations}   │ │ │
│  │  │   docType={DOC_TYPES.PRODUCT}>     │ │ │
│  │  │                                     │ │ │
│  │  │   ✅ Context available here         │ │ │
│  │  │   but can't flow upward to header  │ │ │
│  │  │                                     │ │ │
│  │  └─────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Problem:** React context flows downward (parent → child), not upward (child → parent).

### Current LocaleSwitcher Behavior

**File:** `frontend/components/header/locale-switcher.tsx`

```tsx
// Line 36: Attempts to read context
const { allTranslations, currentDocType } = useTranslations();

// Lines 57-77: Translation-aware routing (never executes)
if (allTranslations && allTranslations.length > 0 && currentDocType) {
  const translation = allTranslations.find((t) => t.lang === target);
  if (translation?.slug) {
    const href = resolveHref(currentDocType, translation.slug, target);
    if (href) {
      router.push(href + queryString); // ✅ This would work!
      return;
    }
  }
}

// Lines 79-88: Fallback - simple path swap (always executes)
const { path } = stripLocalePrefix(currentPath);
const href = buildLocalizedPath(target, path) + queryString;
router.push(href); // ❌ Creates wrong URL
```

**Result:** Fallback always executes because `allTranslations` is `undefined`.

---

## Supporting Infrastructure (All Complete ✅)

### Translation Query Fragment

**File:** `frontend/sanity/lib/queries/fragments.ts`

```typescript
export const TRANSLATIONS_QUERY_FRAGMENT = groq`
  "allTranslations": *[_type == "translation.metadata" && ^._id in translations[].value._ref][0].translations[] {
    "lang": _key,
    "slug": value->slug.current
  } [defined(slug) && defined(lang)]
`;
```

✅ Used in all 4 page type queries

### Document Type Definitions

**File:** `frontend/lib/docTypes.ts`

```typescript
export const DOC_TYPES = {
  POST: "post",
  CATEGORY: "category",
  PRODUCT: "product",
  PRODUCT_CATEGORY: "productCategory",
  // ...
} as const;

export const CATEGORY_DOC_TYPES = [
  DOC_TYPES.BLOG_CATEGORY,
  DOC_TYPES.POST_CATEGORY,
  DOC_TYPES.CATEGORY,
];
```

✅ All doc types properly defined

### Route Resolution

**File:** `frontend/lib/resolveHref.ts`

| Doc Type           | Route Pattern                | Status                                    |
| ------------------ | ---------------------------- | ----------------------------------------- |
| `POST`             | `/blog/${slug}`              | ✅ Implemented                            |
| `CATEGORY`         | `/blog/category/${slug}`     | ✅ Implemented (via `CATEGORY_DOC_TYPES`) |
| `PRODUCT`          | `/products/${slug}`          | ✅ Implemented                            |
| `PRODUCT_CATEGORY` | `/products/category/${slug}` | ✅ Implemented                            |

✅ All routes properly mapped

---

## Solution Options

### Option 1: Effect-based Global Context ⭐ (Recommended)

Create a global translation context at layout level that pages can update.

**Pros:**

- Works with current architecture
- No additional API calls
- Clean separation of concerns
- SSR-friendly

**Cons:**

- Brief moment during navigation where translations might be stale
- Requires state management

**Implementation:**

1. Create `GlobalTranslationProvider` at layout level with state
2. Create `useSetPageTranslations(translations, docType)` hook for pages
3. Pages call hook in `useEffect` to update global state
4. LocaleSwitcher reads from global context

---

### Option 2: URL-based Detection + Client Fetch

Make LocaleSwitcher parse URL and fetch its own translation data.

**Pros:**

- No context complexity
- Always up-to-date
- Works for direct navigation

**Cons:**

- Additional API call on every switch
- Duplicate data fetching
- Requires pathname parsing logic

**Implementation:**

1. Parse pathname: `/nl/products/gepelde-gierstzaden`
2. Detect page type (product, blog post, etc.)
3. Fetch translations via Sanity client
4. Use translations to build target URL

---

### Option 3: Data Attributes Pattern

Pages render hidden DOM element with translation data that switcher reads.

**Pros:**

- Simple implementation
- No additional fetches
- SSR-friendly

**Cons:**

- DOM manipulation in React
- Race conditions possible
- Feels hacky

**Implementation:**

1. Page renders: `<script type="application/json" id="translations">{...}</script>`
2. Switcher reads: `document.getElementById('translations')`
3. Parse and use data

---

### Option 4: Move LocaleSwitcher Inside Pages (Not Recommended)

Each page renders its own switcher inside provider.

**Pros:**

- Context just works

**Cons:**

- Massive code duplication
- Breaks DRY principle
- Maintenance nightmare

---

## Impact Assessment

### Pages Affected: 100%

All dynamically routed pages with translations are affected:

- ❌ All blog posts
- ❌ All blog categories
- ❌ All products
- ❌ All product categories

### Pages Unaffected

Static routes work correctly (no slug translation needed):

- ✅ Home page (`/` → `/`)
- ✅ Contact (`/contact` → `/contact`)
- ✅ About (`/about` → `/about`)

### User Impact

**Current Production Behavior:**

1. User browses site in Dutch ✅
2. User clicks language switcher to English
3. URL changes to `/en/...` but keeps Dutch slug
4. Page returns 404 error ❌
5. User frustrated, stuck in Dutch language ❌

---

## Recommended Action Plan

### Phase 1: Implement Global Context Solution

1. **Create global translation context**

   - File: `frontend/lib/contexts/global-translation-context.tsx`
   - Provides state + setter at layout level

2. **Update layout to wrap with provider**

   - File: `frontend/app/[lang]/layout.tsx`
   - Add `<GlobalTranslationProvider>` wrapper

3. **Create hook for pages to set translations**

   - Hook: `useSetPageTranslations(translations, docType)`
   - Called in page components via `useEffect`

4. **Update all 4 page types**

   - Replace `PageTranslationProvider` with hook call
   - Keep existing translation fetching logic

5. **Update LocaleSwitcher**
   - Read from global context instead of local
   - Keep fallback logic for static routes

### Phase 2: Testing

1. Test each page type with different slugs
2. Verify navigation between languages
3. Test direct URL access
4. Verify fallback for static routes

### Phase 3: Deployment

1. Deploy to staging
2. User acceptance testing
3. Deploy to production
4. Monitor for errors

---

## Technical Debt Notes

### Current Workaround

The locale switcher currently falls back to simple path-based switching:

```tsx
const { path } = stripLocalePrefix(currentPath);
const href = buildLocalizedPath(target, path) + queryString;
```

This **only works if slugs are identical** across languages. For product categories where user mentioned slugs are the same, this accidentally works. For all other content types with localized slugs, it fails.

### Why Infrastructure Was Built

All the translation infrastructure (queries, providers, routing) was correctly implemented anticipating translation-aware routing. The only missing piece is making that translation data accessible to the layout-level locale switcher.

---

## References

### Key Files

- `frontend/components/header/locale-switcher.tsx` - Switcher component
- `frontend/lib/contexts/translation-context.tsx` - Current context (page-level)
- `frontend/components/providers/page-translation-provider.tsx` - Current provider
- `frontend/sanity/lib/queries/fragments.ts` - Translation query fragment
- `frontend/lib/resolveHref.ts` - Route resolution logic

### Related Issues

- User reported: https://largseeds.nl 404 errors when switching languages
- Git branch: `seo-start` (merged to `main`)
- Last commit: Locale switcher fallback implementation

---

**End of Audit**
