import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  LOCALE_COOKIE_NAME,
  resolveRequestedLocale,
  buildLocalizedPath,
} from "@/lib/i18n/routing";

export default async function RootRedirect() {
  const cookieStore = await cookies();
  const requestHeaders = await headers();

  const requestedLocale = resolveRequestedLocale({
    cookie: cookieStore.get(LOCALE_COOKIE_NAME)?.value,
    acceptLanguage: requestHeaders.get("accept-language"),
  });

  const target = buildLocalizedPath(requestedLocale, "/");

  redirect(target === "//" ? "/" : target);
}
