import SectionContainer from "@/components/ui/section-container";

import { PAGE_QUERYResult } from "@/sanity.types";
import { fetchSanityChangelogs } from "@/sanity/lib/fetch";
import Changelog5 from "./changelog5";
import type { SupportedLocale } from "@/lib/i18n/config";
import { FALLBACK_LOCALE } from "@/lib/i18n/config";
type Changelogs5Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "changelog-5" }
>;

export default async function Changelog5Main({
  padding,
  title,
  secondaryTitle,
  links,
  locale = FALLBACK_LOCALE,
}: Changelogs5Props & { locale?: SupportedLocale }) {
  const changelogs = await fetchSanityChangelogs();

  return (
    <SectionContainer padding={padding} withContainer={false}>
      <Changelog5
        title={title}
        secondaryTitle={secondaryTitle}
        links={links}
        changelogs={changelogs}
        locale={locale}
      />
    </SectionContainer>
  );
}
