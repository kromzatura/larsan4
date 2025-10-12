import { describe, it, expect } from "vitest";
import { buildLocalizedPath, stripLocalePrefix } from "@/lib/i18n/routing";

describe("buildLocalizedPath", () => {
  it("prefixes all locale paths, including default", () => {
    expect(buildLocalizedPath("nl", "/products")).toBe("/nl/products");
    expect(buildLocalizedPath("nl", "products")).toBe("/nl/products");
    expect(buildLocalizedPath("en", "/products")).toBe("/en/products");
    expect(buildLocalizedPath("en", "products")).toBe("/en/products");
  });

  it("handles root path", () => {
    expect(buildLocalizedPath("nl", "/")).toBe("/nl");
    expect(buildLocalizedPath("en", "/")).toBe("/en");
  });

  it("passes through query strings when present in input (discouraged usage)", () => {
    // Note: callers should append query strings AFTER building the localized path.
    expect(buildLocalizedPath("nl", "/products?x=1")).toBe("/nl/products?x=1");
    expect(buildLocalizedPath("en", "/products?x=1")).toBe("/en/products?x=1");
  });
});

describe("stripLocalePrefix", () => {
  it("removes supported locale prefix and returns remainder path", () => {
    const res = stripLocalePrefix("/nl/products");
    expect(res.locale).toBe("nl");
    expect(res.path).toBe("/products");
  });

  it("returns fallback locale when no prefix present", () => {
    const res = stripLocalePrefix("/products");
    expect(res.locale).toBe("en");
    expect(res.path).toBe("/products");
  });

  it("handles root path with locale", () => {
    const res = stripLocalePrefix("/nl");
    expect(res.locale).toBe("nl");
    expect(res.path).toBe("/");
  });

  it("handles root path without locale", () => {
    const res = stripLocalePrefix("/");
    expect(res.locale).toBe("en");
    expect(res.path).toBe("/");
  });
});
