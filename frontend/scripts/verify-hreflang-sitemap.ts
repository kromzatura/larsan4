/*
 Hreflang reciprocity audit across sitemap.
 Usage: pnpm --filter sanityblocks check:hreflang:sitemap [baseUrl]
 Defaults to https://largseeds.nl
*/
/* eslint-disable no-console */

export {};

type Alt = { hreflang: string; href: string };

type Result = {
  url: string;
  ok: boolean;
  missingFor?: Array<{ alt: string; href: string; expected: string }>; // which alt page lacked the return link
  error?: string;
};

function extractLocs(xml: string): string[] {
  const locs: string[] = [];
  const re = /<loc>\s*([^<\s][^<]*)\s*<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) locs.push(m[1].trim());
  return Array.from(new Set(locs));
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

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { Accept: "text/html,application/xhtml+xml" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function checkReciprocity(url: string): Promise<Result> {
  try {
    const html = await fetchText(url);
    const alts = extractAlternates(html);
    const originLocale = getLocaleFromUrl(url) ?? "";
    const nonDefault = alts.filter(
      (a) => a.hreflang.toLowerCase() !== "x-default"
    );
    const missing: Result["missingFor"] = [];

    for (const alt of nonDefault) {
      try {
        const altHtml = await fetchText(alt.href);
        const altAlts = extractAlternates(altHtml);
        const hasReturn = altAlts.some(
          (a) =>
            a.hreflang.toLowerCase() === originLocale &&
            a.href.split("#")[0] === url
        );
        if (!hasReturn)
          missing.push({ alt: alt.hreflang, href: alt.href, expected: url });
      } catch (e: any) {
        missing.push({ alt: alt.hreflang, href: alt.href, expected: url });
      }
    }

    return {
      url,
      ok: missing.length === 0,
      missingFor: missing.length ? missing : undefined,
    };
  } catch (e: any) {
    return { url, ok: false, error: e?.message || String(e) };
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
      const r = await checkReciprocity(next);
      results.push(r);
      if (r.ok) {
        console.log(`[OK] ${next}`);
      } else if (r.missingFor && r.missingFor.length) {
        console.log(`[MISSING] ${next}`);
        for (const m of r.missingFor) {
          console.log(
            `  ↳ ${m.alt} page missing return link: ${m.href} (expected hreflang back to ${m.expected})`
          );
        }
      } else {
        console.log(`[ERROR] ${next} (${r.error})`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const missing = results.filter((r) => !r.ok);
  console.log("\nSummary");
  console.log("=======");
  console.log(`Checked: ${results.length}`);
  console.log(`With issues: ${missing.length}`);
  if (missing.length) {
    console.log("\nPages with hreflang reciprocity issues:");
    for (const r of missing) console.log(`- ${r.url}`);
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
