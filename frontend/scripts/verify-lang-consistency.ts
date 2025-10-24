/*
 Lang consistency check across sitemap:
 - Ensures <html lang> primary (e.g., en from en-US) matches URL locale segment
 - Ensures a self hreflang alternate exists for that locale pointing to the same URL (or its canonical)
 Usage: pnpm --filter sanityblocks check:lang [baseUrl]
 Defaults to https://largseeds.nl
*/
/* eslint-disable no-console */

export {};

type Alt = { hreflang: string; href: string };

type Result = {
  url: string;
  expectedLocale?: string;
  htmlLang?: string;
  htmlPrimary?: string;
  canonical?: string;
  hasSelfAlt?: boolean;
  ok: boolean;
  errors?: string[];
};

function extractLocs(xml: string): string[] {
  const locs: string[] = [];
  const re = /<loc>\s*([^<\s][^<]*)\s*<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) locs.push(m[1].trim());
  return Array.from(new Set(locs));
}

function extractHtmlLang(html: string): string | undefined {
  const m = /<html[^>]*\blang=["']([^"']+)["'][^>]*>/i.exec(html);
  return m?.[1].trim();
}

function extractCanonical(html: string): string | undefined {
  const m = /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i.exec(
    html
  );
  return m?.[1];
}

function extractAlternates(html: string): Alt[] {
  const results: Alt[] = [];
  const re = /<link\s+[^>]*rel=["']alternate["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const tag = m[0];
    const hreflang = /hreflang=["']([^"']+)["']/i.exec(tag)?.[1];
    const href = /href=["']([^"']+)["']/i.exec(tag)?.[1];
    if (href && hreflang) results.push({ hreflang, href });
  }
  return results;
}

function getLocaleFromUrl(u: string): string | undefined {
  try {
    const url = new URL(u);
    const seg = url.pathname.split("/").filter(Boolean)[0];
    if (seg && /^([a-z]{2})$/i.test(seg)) return seg.toLowerCase();
  } catch {}
  return undefined;
}

function normalizePrimaryLang(lang?: string): string | undefined {
  if (!lang) return undefined;
  const lower = lang.toLowerCase();
  const match = /^([a-z]{2})/.exec(lower);
  return match?.[1];
}

function sameUrl(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  try {
    const A = new URL(a);
    const B = new URL(b);
    // Ignore trailing slash differences
    const pA = A.pathname.replace(/\/$/, "");
    const pB = B.pathname.replace(/\/$/, "");
    return A.origin === B.origin && pA === pB && A.search === B.search;
  } catch {
    return a === b;
  }
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { Accept: "text/html,application/xhtml+xml" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function checkUrl(url: string): Promise<Result> {
  try {
    const html = await fetchText(url);
    const expectedLocale = getLocaleFromUrl(url);
    const htmlLang = extractHtmlLang(html);
    const htmlPrimary = normalizePrimaryLang(htmlLang);
    const canonical = extractCanonical(html);
    const alts = extractAlternates(html);

    const selfHref = canonical || url;
    const hasSelfAlt = alts.some(
      (a) => a.hreflang.toLowerCase() === (expectedLocale || "") && sameUrl(a.href, selfHref)
    );

    const errors: string[] = [];
    if (!expectedLocale) errors.push("No locale in URL path");
    if (!htmlLang) errors.push("No <html lang> attribute found");
    if (expectedLocale && htmlPrimary && expectedLocale !== htmlPrimary) {
      errors.push(`Mismatch: URL locale=${expectedLocale} vs html lang=${htmlLang}`);
    }
    if (expectedLocale && !hasSelfAlt) {
      errors.push(`Missing self hreflang=${expectedLocale} pointing to ${selfHref}`);
    }

    return {
      url,
      expectedLocale,
      htmlLang,
      htmlPrimary,
      canonical,
      hasSelfAlt,
      ok: errors.length === 0,
      errors: errors.length ? errors : undefined,
    };
  } catch (e: any) {
    return { url, ok: false, errors: [e?.message || String(e)] };
  }
}

async function main() {
  const base = process.argv[2] || "https://largseeds.nl";
  const sitemapUrl = new URL("/sitemap.xml", base).toString();
  console.log(`Reading sitemap: ${sitemapUrl}`);
  const xml = await fetchText(sitemapUrl);
  const urls = extractLocs(xml).filter((u) => u.startsWith(base));

  const CONCURRENCY = 6;
  const queue = urls.slice();
  const results: Result[] = [];

  async function worker() {
    for (;;) {
      const next = queue.shift();
      if (!next) break;
      const r = await checkUrl(next);
      results.push(r);
      if (r.ok) {
        console.log(`[OK] ${next}`);
      } else {
        console.log(`[ISSUE] ${next}`);
        for (const err of r.errors || []) console.log(`  - ${err}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const issues = results.filter((r) => !r.ok);
  console.log("\nSummary");
  console.log("=======");
  console.log(`Checked: ${results.length}`);
  console.log(`With issues: ${issues.length}`);
  if (issues.length) {
    console.log("\nPages with lang/hreflang issues:");
    for (const r of issues) console.log(`- ${r.url}`);
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
