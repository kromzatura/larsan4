"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_COOKIE_NAME,
  buildLocalizedPath,
  stripLocalePrefix,
} from "@/lib/i18n/routing";
import {
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/contexts/translation-context";
import { resolveHref } from "@/lib/resolveHref";

type Props = {
  locale: SupportedLocale;
  className?: string;
  variant?: "inline" | "menu";
  onCloseMenu?: () => void;
};

export default function LocaleSwitcher({
  locale,
  className,
  variant = "inline",
  onCloseMenu,
}: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { allTranslations, currentDocType } = useTranslations();

  const queryString = useMemo(() => {
    if (!searchParams) return "";
    const entries = Array.from(searchParams.entries());
    if (entries.length === 0) return "";
    const usp = new URLSearchParams(entries);
    const qs = usp.toString();
    return qs ? `?${qs}` : "";
  }, [searchParams]);

  const currentPath = pathname || "/";

  const handleLocaleSwitch = useCallback(
    (target: SupportedLocale) => {
      // Set locale cookie
      try {
        document.cookie = `${LOCALE_COOKIE_NAME}=${target}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}`;
      } catch {}

      // Translation-aware routing: check if we have translation data
      // Note: This only works when LocaleSwitcher is rendered inside PageTranslationProvider
      if (allTranslations && allTranslations.length > 0 && currentDocType) {
        const translation = allTranslations.find((t) => t.lang === target);

        if (translation?.slug) {
          // Use resolveHref to build correct URL with route prefixes
          const href = resolveHref(currentDocType, translation.slug, target);

          if (href) {
            router.push(href + queryString);
            onCloseMenu?.();
            return;
          }
        }

        // If target translation not found but we have translations array,
        // it means the content doesn't exist in the target language
        // Go to locale home as fallback
        router.push(buildLocalizedPath(target, "/"));
        onCloseMenu?.();
        return;
      }

      // Default: Simple path-based switching
      // Works for:
      // - Static routes (home, contact, about)
      // - Product categories (when slugs are identical across languages)
      // - Any route where LocaleSwitcher is outside PageTranslationProvider
      const { path } = stripLocalePrefix(currentPath);
      const href = buildLocalizedPath(target, path) + queryString;
      router.push(href);
      onCloseMenu?.();
    },
    [
      currentPath,
      queryString,
      router,
      allTranslations,
      currentDocType,
      onCloseMenu,
    ]
  );

  const onSelect = handleLocaleSwitch;

  if (variant === "menu") {
    // Simple select for mobile/drawer usage
    return (
      <select
        className={cn(
          "w-full rounded-md border bg-background px-3 py-2 text-sm",
          className
        )}
        value={locale}
        onChange={(e) => onSelect(e.target.value as SupportedLocale)}
        aria-label="Select language"
      >
        {SUPPORTED_LOCALES.map((l) => (
          <option key={l} value={l}>
            {LOCALE_LABELS[l]}
          </option>
        ))}
      </select>
    );
  }

  // Inline compact pill list (desktop)
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {SUPPORTED_LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onSelect(l)}
          className={cn(
            "rounded-md px-2 py-1 text-xs font-medium transition-colors",
            l === locale
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          )}
          aria-current={l === locale ? "true" : undefined}
          aria-label={`Switch language to ${LOCALE_LABELS[l]}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
