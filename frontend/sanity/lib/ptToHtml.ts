type Block = any;

export function ptBlocksToHtml(blocks: Block[] | null | undefined): string {
  if (!Array.isArray(blocks) || blocks.length === 0) return "";
  const out: string[] = [];
  for (const b of blocks) {
    if (b?._type === "block") {
      const tag =
        ({ h1: "h1", h2: "h2", h3: "h3", h4: "h4" } as any)[b?.style] || "p";
      const text = Array.isArray(b.children)
        ? b.children.map((c: any) => c?.text || "").join("")
        : "";
      out.push(`<${tag}>${escapeHtml(text)}</${tag}>`);
    } else if (b?._type === "image" && b?.asset?.url) {
      out.push(`<p><img src="${b.asset.url}" alt=""/></p>`);
    }
  }
  return out.join("");
}

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
