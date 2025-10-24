const { groq } = require("next-sanity");
// Note: The require paths might need adjustment based on your project structure.
// This assumes `sanityFetch` and i18n helpers can be correctly required in a CJS context.
const { sanityFetch } = require("./sanity/lib/live");
const { SUPPORTED_LOCALES, DEFAULT_LOCALE } = require("./lib/i18n/config");
const { buildLocalizedPath, isSupportedLocale } = require("./lib/i18n/routing");

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function getAllDocumentsForSitemap() {
  const query = groq`*[_type in ['page', 'post', 'product', 'productCategory', 'category'] && defined(slug.current) && !(_id in path("drafts.**"))]{
    "slug": slug.current,
    "docType": _type,
    "lastModified": _updatedAt,
    language,
    "allTranslations": *[_type == "translation.metadata" && ^._id in translations[].value._ref][0].translations[defined(value->slug.current) && defined(_key)]{
      "lang": _key,
      "slug": value->slug.current
    }
  }`;

  try {
    const data = await sanityFetch({
      query,
      perspective: "published",
      stega: false,
    });
    return data || [];
  } catch (error) {
    console.error("Error fetching documents for sitemap:", error);
    return [];
  }
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: baseUrl,
  generateRobotsTxt: true,

  // We are generating all paths dynamically, so we can exclude the default Next.js pages.
  exclude: [
    "/404",
    "/[lang]",
    "/[lang]/[slug]",
    "/[lang]/blog/[slug]",
    "/[lang]/products/[slug]",
    "/[lang]/blog/category/[slug]",
    "/[lang]/products/category/[slug]",
  ],

  // The main function to generate all dynamic sitemap paths
  additionalPaths: async (config) => {
    const documents = await getAllDocumentsForSitemap();
    const paths = [];

    for (const doc of documents) {
      const locale = isSupportedLocale(doc.language)
        ? doc.language
        : DEFAULT_LOCALE;

      let pathSegment;
      switch (doc.docType) {
        case "page":
          pathSegment = doc.slug === "index" ? "/" : `/${doc.slug}`;
          break;
        case "post":
          pathSegment = `/blog/${doc.slug}`;
          break;
        case "product":
          pathSegment = `/products/${doc.slug}`;
          break;
        case "productCategory":
          pathSegment = `/products/category/${doc.slug}`;
          break;
        case "category":
          pathSegment = `/blog/category/${doc.slug}`;
          break;
        default:
          continue;
      }

      const alternateRefs = (doc.allTranslations || [])
        .filter((t) => isSupportedLocale(t.lang))
        .map((t) => {
          let altPath;
          switch (doc.docType) {
            case "page":
              altPath = t.slug === "index" ? "/" : `/${t.slug}`;
              break;
            case "post":
              altPath = `/blog/${t.slug}`;
              break;
            case "product":
              altPath = `/products/${t.slug}`;
              break;
            case "productCategory":
              altPath = `/products/category/${t.slug}`;
              break;
            case "category":
              altPath = `/blog/category/${t.slug}`;
              break;
            default:
              return null;
          }
          return {
            href: `${baseUrl}${buildLocalizedPath(t.lang, altPath)}`,
            hreflang: t.lang,
          };
        })
        .filter(Boolean);

      paths.push({
        loc: `${baseUrl}${buildLocalizedPath(locale, pathSegment)}`,
        lastmod: doc.lastModified,
        alternateRefs: alternateRefs,
        changefreq: "weekly",
        priority: 0.7,
      });
    }

    return paths;
  },
};
