/*
 Verify hreflang reciprocity for a given URL.
 Usage: pnpm --filter sanityblocks check:hreflang <url>
*/
/* eslint-disable no-console */

export {};

type Alt = { hreflang: string; href: string };

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

export async function checkReciprocity(url: string) {
  const html = await fetchText(url);
  const alts = extractAlternates(html);
  const originLocale = getLocaleFromUrl(url);
  console.log(`Origin: ${url} (locale=${originLocale ?? "?"})`);
  if (alts.length === 0) {
    console.log("No alternates found.");
    return { ok: false };
  }
  for (const a of alts) console.log(`- alt: ${a.hreflang} -> ${a.href}`);

  const nonDefault = alts.filter(
    (a) => a.hreflang.toLowerCase() !== "x-default"
  );
  let allOk = true;
  for (const alt of nonDefault) {
    try {
      const altHtml = await fetchText(alt.href);
      const altAlts = extractAlternates(altHtml);
      const needs = originLocale ?? "";
      const hasReturn = altAlts.some(
        (a) =>
          a.hreflang.toLowerCase() === needs && a.href.split("#")[0] === url
      );
      if (!hasReturn) {
        allOk = false;
        console.log(
          `RECIPROCITY MISSING: ${alt.href} does not link back with hreflang=${needs}`
        );
      } else {
        console.log(`Reciprocal OK: ${alt.href} -> hreflang=${needs}`);
      }
    } catch (e: any) {
      allOk = false;
      console.log(`Fetch failed for alternate ${alt.href}: ${e?.message || e}`);
    }
  }
  return { ok: allOk };
}

async function main() {
  const url =
    process.argv[2] ||
    "https://largseeds.nl/en/products/category/mustard-flour-and-powders";
  const { ok } = await checkReciprocity(url);
  console.log(`\nResult: ${ok ? "OK" : "ISSUES FOUND"}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
