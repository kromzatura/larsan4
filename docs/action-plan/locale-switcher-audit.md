# Locale Switcher Audit
**Date:** 2025-01-23  
**Status:** CRITICAL ISSUE IDENTIFIED  
**Priority:** HIGH

## Executive Summary

The `LocaleSwitcher` component has a **critical architectural flaw**: it uses path-based locale switching instead of translation-aware routing. This causes 404 errors when switching locales on pages where the slug differs between languages.

### Current Behavior
```
User on: /en/products/black-pepper
Clicks Dutch (nl)
→ Navigates to: /nl/products/black-pepper
→ Result: 404 if Dutch version has slug "zwarte-peper"
```

### Expected Behavior
```
User on: /en/products/black-pepper
Clicks Dutch (nl)
→ Looks up Dutch translation slug from allTranslations
→ Navigates to: /nl/products/zwarte-peper
→ Result: Success - correct localized content
```

---

## Component Analysis

### Current Implementation

**Location:** `frontend/components/header/locale-switcher.tsx`

**Logic Flow:**
1. Gets current path via `usePathname()` → `/en/products/black-pepper`
2. Strips locale via `stripLocalePrefix()` → `/products/black-pepper`
3. Rebuilds with new locale via `buildLocalizedPath()` → `/nl/products/black-pepper`
4. Sets locale cookie
5. Navigates via `router.push()`

**Code:**
```tsx
const onSelect = useCallback(
  (target: SupportedLocale) => {
    try {
      document.cookie = `${LOCALE_COOKIE_NAME}=${target}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}`;
    } catch {}
    const { path } = stripLocalePrefix(currentPath);
    const href = buildLocalizedPath(target, path) + queryString;
    router.push(href);
  },
  [currentPath, queryString, router]
);
```

### Problem Analysis

**Issue:** Path-based approach assumes slugs are identical across locales.

**Reality:** Translation documents in Sanity store locale-specific slugs:
```typescript
"allTranslations": [
  { "lang": "en", "slug": "black-pepper" },
  { "lang": "nl", "slug": "zwarte-peper" }
]
```

**Impact:**
- ❌ Product pages with localized slugs → 404
- ❌ Blog posts with localized slugs → 404
- ❌ Categories with localized slugs → 404
- ✅ Static routes (contact, about) → Works fine
- ✅ Home page → Works fine

---

## Architecture Context

### Data Availability

The switcher is a **client component** with limited context:

**Props received:**
```tsx
type Props = {
  locale: SupportedLocale;
  className?: string;
  variant?: "inline" | "menu";
};
```

**What it DOESN'T have:**
- Current document ID
- Translation metadata (`allTranslations` array)
- Document type (product, post, page, etc.)

### Translation Data Structure

Every document with translations includes:

```typescript
{
  _id: "product-123",
  slug: { current: "black-pepper" },
  language: "en",
  allTranslations: [
    { lang: "en", slug: "black-pepper" },
    { lang: "nl", slug: "zwarte-peper" }
  ]
}
```

This data is:
- ✅ Available in page components
- ✅ Used in `generatePageMetadata()`
- ✅ Used in `sitemap.ts`
- ❌ NOT available in `LocaleSwitcher` component

---

## Solution Options

### Option 1: Pass Translation Data as Props (RECOMMENDED)

**Approach:** Thread translation data from page → layout → navbar → switcher

**Pros:**
- ✅ No additional API calls
- ✅ Type-safe with existing queries
- ✅ Consistent with SSR architecture
- ✅ Works for all content types
- ✅ No client-side data fetching

**Cons:**
- ❌ Requires prop drilling (or Context API)
- ❌ Changes multiple components

**Implementation:**

1. **Update page components to pass translations to layout:**

```tsx
// frontend/app/[lang]/(main)/products/[slug]/page.tsx
export default async function ProductPage({ params }: AsyncPageProps) {
  const { lang, slug } = await params;
  const locale = normalizeLocale(lang);
  const product = await fetchSanityProductBySlug({ slug, lang: locale });
  
  if (!product) return notFound();

  return (
    <>
      {/* Pass translations to components that need them */}
      <ProductPageContent 
        product={product} 
        locale={locale}
        translations={product.allTranslations}
      />
    </>
  );
}
```

2. **Create a TranslationContext provider in layout:**

```tsx
// frontend/app/[lang]/layout.tsx
import { createContext } from 'react';

type TranslationContextValue = {
  allTranslations?: Array<{ lang: string; slug: string }>;
  currentDocType?: string;
};

export const TranslationContext = createContext<TranslationContextValue>({});

export default async function LangLayout({ children, params }) {
  // Layout receives translations from pages and provides to children
  return (
    <TranslationContext.Provider value={{}}>
      {children}
    </TranslationContext.Provider>
  );
}
```

3. **Update LocaleSwitcher to consume context:**

```tsx
// frontend/components/header/locale-switcher.tsx
"use client";

import { useContext } from 'react';
import { TranslationContext } from '@/app/[lang]/layout';
import { resolveHref } from '@/lib/resolveHref';

export default function LocaleSwitcher({ locale, className, variant }: Props) {
  const { allTranslations, currentDocType } = useContext(TranslationContext);
  
  const onSelect = useCallback(
    (target: SupportedLocale) => {
      try {
        document.cookie = `${LOCALE_COOKIE_NAME}=${target}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}`;
      } catch {}
      
      // Try to find translation-aware route first
      if (allTranslations && currentDocType) {
        const translation = allTranslations.find(t => t.lang === target);
        if (translation?.slug) {
          const href = resolveHref(currentDocType, translation.slug, target);
          if (href) {
            router.push(href + queryString);
            return;
          }
        }
      }
      
      // Fallback to path-based switching for static routes
      const { path } = stripLocalePrefix(currentPath);
      const href = buildLocalizedPath(target, path) + queryString;
      router.push(href);
    },
    [currentPath, queryString, router, allTranslations, currentDocType]
  );
  
  // ... rest of component
}
```

**Complexity:** Medium  
**Risk:** Low  
**Recommendation:** ✅ IMPLEMENT THIS

---

### Option 2: Client-Side API Call

**Approach:** Create API endpoint that returns translation slugs for current document

**Pros:**
- ✅ No prop drilling
- ✅ Isolated change

**Cons:**
- ❌ Additional API call per locale switch
- ❌ Slower UX
- ❌ Requires detecting document type/slug from URL
- ❌ Against Next.js best practices (prefer SSR)
- ❌ More complex error handling

**Implementation:**

```tsx
// frontend/app/api/translations/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  // Parse path, fetch translations from Sanity
  // Return: { translations: [...], docType: '...' }
}

// LocaleSwitcher
const onSelect = async (target: SupportedLocale) => {
  const res = await fetch(`/api/translations?path=${currentPath}`);
  const { translations } = await res.json();
  // Navigate to translated slug
};
```

**Complexity:** Medium  
**Risk:** Medium (API failures, loading states)  
**Recommendation:** ❌ AVOID

---

### Option 3: Graceful Fallback with 404 Handling

**Approach:** Keep current behavior, add fallback in not-found page

**Pros:**
- ✅ No immediate changes needed
- ✅ Simple implementation

**Cons:**
- ❌ Poor UX (user sees 404 then redirect)
- ❌ Doesn't solve the core problem
- ❌ Bad for SEO/analytics

**Implementation:**

```tsx
// frontend/app/[lang]/not-found.tsx
export default function NotFound({ params }) {
  const { lang } = params;
  
  // Check if we have locale cookie mismatch
  // Redirect to locale home page
  return <NotFoundContent />;
}
```

**Complexity:** Low  
**Risk:** High (bad UX)  
**Recommendation:** ❌ AVOID

---

### Option 4: Middleware-Based Translation Resolution

**Approach:** Use Next.js middleware to intercept locale switches and resolve translations

**Pros:**
- ✅ Centralized logic
- ✅ No client-side API calls

**Cons:**
- ❌ Complex middleware logic
- ❌ Requires parsing URL patterns
- ❌ Potential performance impact
- ❌ Hard to maintain

**Recommendation:** ❌ AVOID (over-engineered)

---

## Recommended Solution: Option 1 with React Context

### Implementation Plan

#### Phase 1: Create Translation Context (30 min)

1. Create `frontend/lib/contexts/translation-context.tsx`:

```tsx
"use client";

import { createContext, useContext } from 'react';

type TranslationContextValue = {
  allTranslations?: Array<{ lang: string; slug: string }> | null;
  currentDocType?: string;
};

const TranslationContext = createContext<TranslationContextValue>({
  allTranslations: null,
  currentDocType: undefined,
});

export function TranslationProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: TranslationContextValue;
}) {
  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations() {
  return useContext(TranslationContext);
}
```

#### Phase 2: Update Page Layouts (1 hour)

2. Update `frontend/app/[lang]/(main)/layout.tsx`:

```tsx
import { TranslationProvider } from '@/lib/contexts/translation-context';

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = normalizeLocale(lang);
  
  // Note: Individual pages will provide translation data via client components
  return (
    <div>
      <Header locale={locale} />
      {children}
      <Footer locale={locale} />
    </div>
  );
}
```

3. Create wrapper components for pages with translations:

```tsx
// frontend/components/providers/page-translation-provider.tsx
"use client";

import { TranslationProvider } from '@/lib/contexts/translation-context';
import { DOC_TYPES } from '@/lib/docTypes';

type Props = {
  children: React.ReactNode;
  allTranslations?: Array<{ lang: string; slug: string }> | null;
  docType: keyof typeof DOC_TYPES;
};

export function PageTranslationProvider({ 
  children, 
  allTranslations, 
  docType 
}: Props) {
  return (
    <TranslationProvider value={{ allTranslations, currentDocType: docType }}>
      {children}
    </TranslationProvider>
  );
}
```

4. Update page components to wrap content:

```tsx
// frontend/app/[lang]/(main)/products/[slug]/page.tsx
import { PageTranslationProvider } from '@/components/providers/page-translation-provider';
import { DOC_TYPES } from '@/lib/docTypes';

export default async function ProductPage({ params }: AsyncPageProps) {
  const { lang, slug } = await params;
  const locale = normalizeLocale(lang);
  const product = await fetchSanityProductBySlug({ slug, lang: locale });
  
  if (!product) return notFound();

  return (
    <PageTranslationProvider 
      allTranslations={product.allTranslations}
      docType={DOC_TYPES.PRODUCT}
    >
      {/* Existing product page content */}
      <ProductPageContent product={product} locale={locale} />
    </PageTranslationProvider>
  );
}
```

#### Phase 3: Update LocaleSwitcher (45 min)

5. Modify `frontend/components/header/locale-switcher.tsx`:

```tsx
"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_COOKIE_NAME,
  buildLocalizedPath,
  stripLocalePrefix,
} from "@/lib/i18n/routing";
import {
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/contexts/translation-context";
import { resolveHref } from "@/lib/resolveHref";

type Props = {
  locale: SupportedLocale;
  className?: string;
  variant?: "inline" | "menu";
};

export default function LocaleSwitcher({
  locale,
  className,
  variant = "inline",
}: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { allTranslations, currentDocType } = useTranslations();

  const queryString = useMemo(() => {
    if (!searchParams) return "";
    const entries = Array.from(searchParams.entries());
    if (entries.length === 0) return "";
    const usp = new URLSearchParams(entries);
    const qs = usp.toString();
    return qs ? `?${qs}` : "";
  }, [searchParams]);

  const currentPath = pathname || "/";

  const onSelect = useCallback(
    (target: SupportedLocale) => {
      // Set locale cookie
      try {
        document.cookie = `${LOCALE_COOKIE_NAME}=${target}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}`;
      } catch {}

      // Translation-aware routing: check if we have translation data
      if (allTranslations && currentDocType) {
        const translation = allTranslations.find((t) => t.lang === target);
        
        if (translation?.slug) {
          // Use resolveHref to build correct URL with route prefixes
          const href = resolveHref(currentDocType, translation.slug, target);
          
          if (href) {
            router.push(href + queryString);
            return;
          }
        }
        
        // If target translation not found, go to locale home
        // This handles cases where content doesn't exist in target language
        router.push(buildLocalizedPath(target, "/"));
        return;
      }

      // Fallback: path-based switching for static routes (home, contact, etc.)
      // This works fine for routes that don't have locale-specific slugs
      const { path } = stripLocalePrefix(currentPath);
      const href = buildLocalizedPath(target, path) + queryString;
      router.push(href);
    },
    [currentPath, queryString, router, allTranslations, currentDocType]
  );

  // ... rest of component unchanged
}
```

#### Phase 4: Update All Page Routes (2 hours)

6. Apply the pattern to all content type pages:

**Files to update:**
- ✅ `frontend/app/[lang]/(main)/products/[slug]/page.tsx`
- ✅ `frontend/app/[lang]/(main)/products/category/[slug]/page.tsx`
- ✅ `frontend/app/[lang]/(main)/blog/[slug]/page.tsx`
- ✅ `frontend/app/[lang]/(main)/blog/category/[slug]/page.tsx`
- ✅ `frontend/app/[lang]/[slug]/page.tsx` (dynamic pages)

**Static pages DON'T need updates:**
- `/contact` - No localized slugs
- `/blog` - List page, no slug
- `/products` - List page, no slug
- Home page - No slug

#### Phase 5: Testing (1 hour)

7. Test scenarios:

**Test 1: Product with different slugs**
```
Given: User on /en/products/black-pepper
When: User clicks Dutch locale
Then: Navigate to /nl/products/zwarte-peper
```

**Test 2: Blog post with different slugs**
```
Given: User on /en/blog/spice-processing
When: User clicks Dutch locale
Then: Navigate to /nl/blog/specerijen-verwerking
```

**Test 3: Translation doesn't exist**
```
Given: User on /en/products/new-product
And: Dutch translation not published
When: User clicks Dutch locale
Then: Navigate to /nl/ (home page)
```

**Test 4: Static routes still work**
```
Given: User on /en/contact
When: User clicks Dutch locale
Then: Navigate to /nl/contact
```

**Test 5: Home page**
```
Given: User on /en/
When: User clicks Dutch locale
Then: Navigate to /nl/
```

---

## Testing Checklist

- [ ] Create translation context
- [ ] Create PageTranslationProvider component
- [ ] Update LocaleSwitcher to use context
- [ ] Update products/[slug]/page.tsx
- [ ] Update products/category/[slug]/page.tsx
- [ ] Update blog/[slug]/page.tsx
- [ ] Update blog/category/[slug]/page.tsx
- [ ] Update [slug]/page.tsx (dynamic pages)
- [ ] Test product locale switching
- [ ] Test blog locale switching
- [ ] Test category locale switching
- [ ] Test static page locale switching
- [ ] Test home page locale switching
- [ ] Test missing translation fallback
- [ ] Run all tests: `pnpm test`
- [ ] Run type check: `pnpm typecheck`
- [ ] Build test: `pnpm build`
- [ ] Manual browser testing
- [ ] Verify hreflang tags still correct

---

## Impact Assessment

### User Experience
- **Current:** 404 errors when switching locales on translated content
- **After Fix:** Seamless locale switching to correct translated slugs

### Performance
- **No impact:** Uses existing SSR data, no additional API calls
- **Benefit:** Avoids 404 errors and redirects

### Maintenance
- **Pattern:** Establishes clear pattern for translation-aware components
- **Consistency:** Aligns with existing resolveHref usage
- **Future:** Easy to add new content types

### SEO
- **No impact:** hreflang tags already correct (fixed in previous work)
- **Benefit:** Better user engagement metrics (fewer bounces from 404s)

---

## Alternative: Simplified Approach Without Context

If prop drilling concerns are minimal, a simpler approach:

```tsx
// Pass translations directly to Header
<Header locale={locale} translations={product.allTranslations} docType={DOC_TYPES.PRODUCT} />

// Header passes to Navbar
<Navbar1 locale={locale} translations={translations} docType={docType} />

// Navbar passes to LocaleSwitcher
<LocaleSwitcher locale={locale} translations={translations} docType={docType} />
```

**Pros:**
- No Context API needed
- Explicit prop flow
- Easier to debug

**Cons:**
- Props must be threaded through multiple components
- Changes header/navbar signatures

**Recommendation:** Use Context API (cleaner, more scalable)

---

## Conclusion

The LocaleSwitcher has a critical bug that causes 404 errors for translated content. The recommended fix is to:

1. ✅ Create a TranslationContext to share translation data
2. ✅ Update page components to provide translation metadata
3. ✅ Update LocaleSwitcher to use resolveHref with translation data
4. ✅ Fallback to path-based switching for static routes

**Estimated Time:** 4-5 hours  
**Priority:** HIGH (user-facing bug)  
**Complexity:** Medium  
**Risk:** Low (well-isolated changes)

**Next Steps:**
1. Create feature branch: `git checkout -b fix/locale-switcher-translations`
2. Implement Phase 1-3 (core functionality)
3. Test thoroughly
4. Implement Phase 4 (all page routes)
5. Run full test suite
6. Manual testing in browser
7. Merge to main

---

## Related Issues

- ✅ **FIXED:** `generateStaticParams` only generating English pages
- ✅ **FIXED:** `generatePageMetadata` translation URLs missing route prefixes
- ✅ **VERIFIED:** Sitemap correctly using translation data
- 🔄 **THIS ISSUE:** LocaleSwitcher not using translation data

Once this is fixed, the multilingual foundation will be complete and consistent across all components.
