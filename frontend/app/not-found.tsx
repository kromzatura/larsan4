import Custom404 from "@/components/404";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

export default function NotFoundPage() {
  return <Custom404 locale={DEFAULT_LOCALE} />;
}
