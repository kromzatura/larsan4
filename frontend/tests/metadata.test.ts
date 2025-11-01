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
});
