import { toHTML } from "@portabletext/to-html";

export function ptBlocksToHtml(blocks: any[] | null | undefined): string {
  if (!Array.isArray(blocks) || blocks.length === 0) return "";
  return toHTML(blocks as any, {
    components: {
      block: {
        h1: ({ children }) => `<h1>${children}</h1>`,
        h2: ({ children }) => `<h2>${children}</h2>`,
        h3: ({ children }) => `<h3>${children}</h3>`,
        h4: ({ children }) => `<h4>${children}</h4>`,
        normal: ({ children }) => `<p>${children}</p>`,
        blockquote: ({ children }) => `<blockquote>${children}</blockquote>`,
      },
      list: ({ children, value }: any) => {
        const type = value?.list || "bullet";
        if (type === "number") return `<ol>${children}</ol>`;
        return `<ul>${children}</ul>`;
      },
      listItem: ({ children, value }: any) => {
        return `<li>${children}</li>`;
      },
      types: {
        image: ({ value }: any) =>
          value?.asset?.url
            ? `<p><img src="${value.asset.url}" alt="${
                (value?.alt || "") as string
              }"/></p>`
            : "",
        code: ({ value }: any) => {
          const lang = value?.language
            ? ` class="language-${value.language}"`
            : "";
          const code = typeof value?.code === "string" ? value.code : "";
          return `<pre><code${lang}>${escapeHtml(code)}</code></pre>`;
        },
        youtube: ({ value }: any) => {
          const id = value?.videoId;
          if (!id) return "";
          const src = `https://www.youtube.com/embed/${id}`;
          return `<div class="embed-youtube"><iframe src="${src}" title="YouTube video" allowfullscreen loading="lazy"></iframe></div>`;
        },
        alert: ({ value, children }: any) => {
          const title = value?.title
            ? `<strong>${escapeHtml(value.title)}</strong> `
            : "";
          const desc = value?.description ? escapeHtml(value.description) : "";
          return `<div class="alert">${title}${desc}${children ?? ""}</div>`;
        },
      },
      marks: {
        link: ({ children, value }: any) => {
          const href = value?.href || "#";
          const rel = href.startsWith("/") ? "" : ' rel="noopener noreferrer"';
          const target = href.startsWith("/") ? "" : ' target="_blank"';
          return `<a href="${href}"${rel}${target}>${children}</a>`;
        },
      },
    },
  });
}

export function getLanguageFromSettings(settings: any): string {
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
