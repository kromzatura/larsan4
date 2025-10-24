/*
 Simple SEO check: fetch sitemap.xml, visit each URL, and verify a <title> exists.
 Outputs a compact report with [OK] or [MISSING] per URL, plus a summary.
 Usage: pnpm --filter sanityblocks check:titles [baseUrl]
 Defaults to https://largseeds.nl
*/

/* eslint-disable no-console */

export {};

type Result = {
  url: string;
  title?: string;
  canonical?: string;
  ok: boolean;
  error?: string;
};

// Very small, dependency-free XML <loc> extractor
function extractLocs(xml: string): string[] {
  const locs: string[] = [];
  const re = /<loc>\s*([^<\s][^<]*)\s*<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) {
    locs.push(m[1].trim());
  }
  return Array.from(new Set(locs));
}

function extractTitle(html: string): string | undefined {
  const m = /<title>([\s\S]*?)<\/title>/i.exec(html);
  return m?.[1].trim();
}

function extractCanonical(html: string): string | undefined {
  const m =
    /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i.exec(
      html
    );
  return m?.[1];
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      // Force HTML, avoid RSC flight responses
      Accept: "text/html,application/xhtml+xml",
      "User-Agent":
        "SEO-Title-Checker/1.0 (+https://github.com/lar-group) Node.js",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function checkUrl(url: string): Promise<Result> {
  try {
    const html = await fetchText(url);
    const title = extractTitle(html);
    const canonical = extractCanonical(html);
    return { url, title, canonical, ok: Boolean(title) };
  } catch (err: any) {
    return { url, ok: false, error: err?.message || String(err) };
  }
}

async function main() {
  const base = process.argv[2] || "https://largseeds.nl";
  const sitemapUrl = new URL("/sitemap.xml", base).toString();
  console.log(`Reading sitemap: ${sitemapUrl}`);
  const xml = await fetchText(sitemapUrl);
  let urls = extractLocs(xml).filter((u) => u.startsWith(base));
  if (urls.length === 0) {
    console.warn("No <loc> entries found in sitemap.xml; falling back to base");
    urls = [base];
  }

  // Process with small concurrency to be polite
  const CONCURRENCY = 6;
  const queue = urls.slice();
  const results: Result[] = [];

  async function worker() {
    for (;;) {
      const next = queue.shift();
      if (!next) break;
      const r = await checkUrl(next);
      results.push(r);
      const status = r.ok ? "OK" : "MISSING";
      const info = r.title ? ` → ${r.title}` : r.error ? ` (${r.error})` : "";
      console.log(`[${status}] ${next}${info}`);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const missing = results.filter((r) => !r.ok);
  console.log("\nSummary");
  console.log("=======");
  console.log(`Checked: ${results.length}`);
  console.log(`Missing: ${missing.length}`);
  if (missing.length > 0) {
    console.log("\nMissing URLs:");
    for (const r of missing) console.log(`- ${r.url}`);
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
