/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // Ensure the default matches the live domain exactly
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://largseeds.nl",
  generateRobotsTxt: true,
  // The rest of your config will come from the async function below
  // This is a workaround for ESM modules in a CJS file
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: [],
    };
  },
  additionalPaths: async (config) => {
    const { groq } = await import("next-sanity");
    const { sanityFetch } = await import("./sanity/lib/live.js");
    const { buildLocalizedPath, isSupportedLocale } = await import(
      "./lib/i18n/routing.js"
    );
    const { DEFAULT_LOCALE } = await import("./lib/i18n/config.js");

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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

    const documents =
      (await sanityFetch({ query, perspective: "published", stega: false })) ||
      [];
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
