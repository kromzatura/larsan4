import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { TextRoll } from "@/components/ui/text-roll";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { FALLBACK_LOCALE, SupportedLocale } from "@/lib/i18n/config";

export default async function Custom404({
  homeHref = "/",
  locale = FALLBACK_LOCALE,
}: {
  homeHref?: string;
  locale?: SupportedLocale;
}) {
  const dictionary = await getDictionary(locale);
  return (
    <div className="container relative z-20 min-h-[80vh] flex items-center justify-center">
      <div className="relative px-8 md:px-0 py-[4rem] sm:py-[5rem] md:py-[6.25rem] mx-auto sm:max-w-[37.5rem] md:max-w-[40.625rem] lg:max-w-[53.125rem] xl:max-w-[70rem]">
        <h1 className="font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[1.12]">
          <TextRoll>{dictionary.notFound.title}</TextRoll>
        </h1>
        <div className="mt-5 text-center">
          <Link
            href={homeHref}
            className={cn(
              buttonVariants({
                size: "lg",
              })
            )}
          >
            {dictionary.notFound.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
