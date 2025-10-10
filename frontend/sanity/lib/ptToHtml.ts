import { toHTML, type PortableTextComponents } from "@portabletext/to-html";

// Minimal portable text block types used in serialization
interface PortableTextSpan {
  _type?: string;
  text?: string;
  marks?: string[];
}

interface PortableTextBlockBase {
  _key?: string;
  _type: string;
  children?: PortableTextSpan[];
  markDefs?: Array<{ _key?: string; _type?: string; href?: string }>;
  style?: string;
  listItem?: string;
  level?: number;
}

interface ImageBlock {
  _type: "image";
  asset?: { url?: string };
  alt?: string | null;
}

interface CodeBlock {
  _type: "code";
  language?: string;
  code?: string;
}

interface YouTubeBlock {
  _type: "youtube";
  videoId?: string;
}

interface AlertBlock {
  _type: "alert";
  title?: string;
  description?: string;
}

type CustomBlocks = ImageBlock | CodeBlock | YouTubeBlock | AlertBlock;
type AnyBlock = PortableTextBlockBase | CustomBlocks;

interface LinkMarkDef {
  _key?: string;
  _type?: string;
  href?: string;
}

export function ptBlocksToHtml(blocks: unknown[] | null | undefined): string {
  if (!Array.isArray(blocks) || blocks.length === 0) return "";
  const typedBlocks = blocks as AnyBlock[];
  const components: PortableTextComponents = {
    block: {
      h1: ({ children }) => `<h1>${children}</h1>`,
      h2: ({ children }) => `<h2>${children}</h2>`,
      h3: ({ children }) => `<h3>${children}</h3>`,
      h4: ({ children }) => `<h4>${children}</h4>`,
      normal: ({ children }) => `<p>${children}</p>`,
      blockquote: ({ children }) => `<blockquote>${children}</blockquote>`,
    },
    list: ({ children, value }) => {
      const blockValue = value as PortableTextBlockBase | undefined;
      const type = blockValue?.listItem === "number" ? "number" : (blockValue as { list?: string } | undefined)?.list || "bullet"; // fallback
      if (type === "number") return `<ol>${children}</ol>`;
      return `<ul>${children}</ul>`;
    },
    listItem: ({ children }) => `<li>${children}</li>`,
    types: {
      image: ({ value }) => {
        const v = value as ImageBlock;
        return v?.asset?.url
          ? `<p><img src="${v.asset.url}" alt="${escapeHtml(v.alt || "")}"/></p>`
          : "";
      },
      code: ({ value }) => {
        const v = value as CodeBlock;
        const lang = v?.language ? ` class="language-${v.language}"` : "";
        const code = typeof v?.code === "string" ? v.code : "";
        return `<pre><code${lang}>${escapeHtml(code)}</code></pre>`;
      },
      youtube: ({ value }) => {
        const v = value as YouTubeBlock;
        const id = v?.videoId;
        if (!id) return "";
        const src = `https://www.youtube.com/embed/${id}`;
        return `<div class="embed-youtube"><iframe src="${src}" title="YouTube video" allowfullscreen loading="lazy"></iframe></div>`;
      },
      alert: (opts) => {
        const v = (opts as { value: AlertBlock }).value;
        const children = (opts as { children?: string }).children;
        const title = v?.title ? `<strong>${escapeHtml(v.title)}</strong> ` : "";
        const desc = v?.description ? escapeHtml(v.description) : "";
        return `<div class=\"alert\">${title}${desc}${children ?? ""}</div>`;
      },
    },
    marks: {
      link: ({ children, value }) => {
        const href = (value as LinkMarkDef)?.href || "#";
        const rel = href.startsWith("/") ? "" : ' rel="noopener noreferrer"';
        const target = href.startsWith("/") ? "" : ' target="_blank"';
        return `<a href="${href}"${rel}${target}>${children}</a>`;
      },
    },
  };
  return toHTML(typedBlocks as Parameters<typeof toHTML>[0], { components });
}

export function getLanguageFromSettings(settings: { language?: string; siteLanguage?: string; locale?: string } | null | undefined): string {
  const lang = settings?.language || settings?.siteLanguage || settings?.locale;
  if (typeof lang === "string" && lang.trim()) return lang;
  return "en-US";
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
