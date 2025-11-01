import { describe, it, expect, vi } from "vitest";
// Mock Sanity image + fetch helpers to avoid env requirements during tests
vi.mock("@/sanity/lib/image", () => ({
  urlFor: () => ({
    quality: () => ({ url: () => "http://example.com/og.jpg" }),
  }),
}));
vi.mock("@/sanity/lib/fetch", () => ({
  getOgImageUrl: () => "http://example.com/og.jpg",
}));
import { generatePageMetadata } from "@/sanity/lib/metadata";
import type { SupportedLocale } from "@/lib/i18n/config";
import { buildCanonicalUrl } from "@/lib/url";

// Helper to read the title value consistently
function getTitleValue(
  title: ReturnType<typeof generatePageMetadata>["title"]
) {
  if (typeof title === "string" || typeof title === "undefined") return title;
  // If Next's MetadataTitle object is passed in the future, adjust here.
  return String(title as any);
}

describe("generatePageMetadata – title", () => {
  it("returns the raw title without brand suffix (layout adds branding)", () => {
    const locale = "en" as SupportedLocale;
    const meta = generatePageMetadata({
      page: {
        meta: {
          title: "About us",
          description: "About page",
        },
        allTranslations: [
          { lang: "en", slug: "about" },
          { lang: "nl", slug: "about" },
        ],
      },
      slug: "about",
      type: "page",
      locale,
    });

    const title = getTitleValue(meta.title);
    expect(title).toBe("About us");
    // Ensure we are not accidentally appending the brand here
    expect(title?.includes("LAR Group")).toBe(false);
  });

  it("includes a self hreflang entry for the current locale", () => {
    const locale = "en" as SupportedLocale;
    const meta = generatePageMetadata({
      page: {
        meta: { title: "Contact" },
        // Note: even if self translation is omitted, implementation should add it
        allTranslations: [{ lang: "nl", slug: "contact" }],
      },
      slug: "contact",
      type: "page",
      locale,
    });

    const langs = meta.alternates?.languages as
      | Record<string, string>
      | undefined;
    expect(langs).toBeTruthy();
    // Default base URL in test env is http://localhost:3000
    expect(langs?.["en"]).toBe("http://localhost:3000/en/contact");
  });

  it("adds x-default even when default translation missing (fallback to canonical)", () => {
    const locale = "en" as SupportedLocale;
    const meta = generatePageMetadata({
      page: {
        meta: { title: "Contact" },
        // No translations present
        allTranslations: [],
      },
      slug: "contact",
      type: "page",
      locale,
    });

    const langs = meta.alternates?.languages as
      | Record<string, string>
      | undefined;
    expect(langs).toBeTruthy();
    expect(langs?.["x-default"]).toBe(buildCanonicalUrl(locale, "/contact"));
  });

  it("falls back to a humanized slug when meta.title and page.title are missing (generic page)", () => {
    const locale = "en" as SupportedLocale;
    const meta = generatePageMetadata({
      page: {
        meta: {
          // no title
          description: "FAQ",
        },
        allTranslations: [{ lang: "en", slug: "faq" }],
      },
      slug: "faq",
      type: "page",
      locale,
    });

    const title = getTitleValue(meta.title);
    expect(title).toBe("Faq");
  });

  it("uses type-aware fallback for productCategory (Category: <Slug>) when title is missing", () => {
    const locale = "en" as SupportedLocale;
    const meta = generatePageMetadata({
      page: {
        meta: {
          // no title
        },
        allTranslations: [
          { lang: "en", slug: "products/category/oilseeds" },
          { lang: "nl", slug: "products/category/oilseeds" },
        ],
      },
      slug: "products/category/oilseeds",
      type: "productCategory",
      locale,
    });

    const title = getTitleValue(meta.title);
    expect(title).toBe("Category: Oilseeds");
  });

  it("falls back to humanized slug for product when meta.title and title are missing", () => {
    const locale = "en" as SupportedLocale;
    const meta = generatePageMetadata({
      page: {
        meta: {},
        allTranslations: [{ lang: "en", slug: "products/black-mustard" }],
      },
      slug: "products/black-mustard",
      type: "product",
      locale,
    });

    const title = getTitleValue(meta.title);
    expect(title).toBe("Black Mustard");
  });

  it("uses product excerpt as description fallback when meta.description is missing", () => {
    const locale = "en" as SupportedLocale;
    const excerpt = "Short product summary for SEO.";
    const meta = generatePageMetadata({
      page: {
        meta: {},
        excerpt,
        allTranslations: [{ lang: "en", slug: "products/test-product" }],
      } as any,
      slug: "products/test-product",
      type: "product",
      locale,
    });

    expect(meta.description).toBe(excerpt);
    expect(meta.openGraph?.description).toBe(excerpt);
  });

  it("uses post excerpt as description fallback and sets Twitter card", () => {
    const locale = "en" as SupportedLocale;
    const excerpt = "Short blog summary for SEO.";
    const meta = generatePageMetadata({
      page: {
        meta: {},
        excerpt,
        allTranslations: [{ lang: "en", slug: "blog/hello-world" }],
      } as any,
      slug: "blog/hello-world",
      type: "post",
      locale,
    });

    expect(meta.description).toBe(excerpt);
    expect(meta.openGraph?.description).toBe(excerpt);
    expect((meta as any).twitter?.card).toBe("summary_large_image");
  });

  it("sets x-default to bare site root for homepage to avoid duplicates", () => {
    const locale = "en" as SupportedLocale;
    const meta = generatePageMetadata({
      page: {
        meta: {},
        allTranslations: [
          { lang: "en", slug: "index" },
          { lang: "nl", slug: "index" },
        ],
      } as any,
      slug: "index",
      type: "page",
      locale,
    });
    const langs = (meta.alternates as any)?.languages;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    expect(langs?.["x-default"]).toBe(`${baseUrl}/`);
    expect(langs?.en).toBe(`${baseUrl}/en`);
    expect(langs?.nl).toBe(`${baseUrl}/nl`);
  });
});
