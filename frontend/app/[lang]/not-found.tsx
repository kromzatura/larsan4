import Custom404 from "@/components/404";
import { buildLocalizedPath, normalizeLocale } from "@/lib/i18n/routing";

export default function LangNotFound({
  params,
}: {
  params: { lang?: string };
}) {
  const locale = normalizeLocale(params?.lang);
  const homeHref = buildLocalizedPath(locale, "/");
  return <Custom404 homeHref={homeHref} locale={locale} />;
}
