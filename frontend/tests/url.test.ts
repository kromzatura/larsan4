import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildAbsoluteUrl } from "@/lib/url";

// Snapshot and restore env to avoid bleed between tests
const originalEnv = { ...process.env };

beforeAll(() => {
  process.env.NEXT_PUBLIC_SITE_URL = "https://www.example.com";
});

afterAll(() => {
  process.env = originalEnv;
});

describe("buildAbsoluteUrl", () => {
  it("prefixes a non-default locale", () => {
    const url = buildAbsoluteUrl("nl", "/blog/mijn-post");
    expect(url).toBe("https://www.example.com/nl/blog/mijn-post");
  });

  it("prefixes the default locale (en)", () => {
    const url = buildAbsoluteUrl("en", "/blog/my-post");
    expect(url).toBe("https://www.example.com/en/blog/my-post");
  });

  it("handles the root path for a non-default locale", () => {
    const url = buildAbsoluteUrl("nl", "/");
    expect(url).toBe("https://www.example.com/nl");
  });

  it("handles the root path for the default locale", () => {
    const url = buildAbsoluteUrl("en", "/");
    expect(url).toBe("https://www.example.com/en");
  });
});
