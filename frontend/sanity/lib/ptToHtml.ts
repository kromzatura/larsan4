import { toHTML } from "@portabletext/to-html";

export function ptBlocksToHtml(blocks: any[] | null | undefined): string {
  if (!Array.isArray(blocks) || blocks.length === 0) return "";
  return toHTML(blocks as any, {
    components: {
      types: {
        image: ({ value }: any) =>
          value?.asset?.url
            ? `<p><img src="${value.asset.url}" alt=""/></p>`
            : "",
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
