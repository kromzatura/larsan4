import slugify from "./slugify";
import { fetchSanityNavigation } from "@/sanity/lib/fetch";
import { resolveLocalizedHref } from "./resolveHref";

type NavLink = {
  _key: string;
  _type: string;
  title?: string;
  href?: string | null;
  internalType?: string;
  internalSlug?: string;
  target?: boolean;
  buttonVariant?: string;
};

interface NavGroup extends NavLink {
  _type: "link-group";
  links?: (NavLink | NavGroup)[];
}

function isGroup(item: NavLink | NavGroup): item is NavGroup {
  return item._type === "link-group";
}

function applyResolvedHref<T extends NavLink | NavGroup>(item: T, lang: string): T {
  if (isGroup(item)) {
    const links = item.links?.map((l) => applyResolvedHref(l as any, lang)) ?? [];
    return { ...(item as any), links } as T;
  }
  if (item.internalType && item.internalSlug) {
    const href =
      resolveLocalizedHref(item.internalType, item.internalSlug, lang) ??
      item.href ??
      null;
    return { ...(item as any), href } as T;
  }
  return item;
}

export const getNavigationItems = async (keyOrTitle: string, lang: string = "en") => {
  const navigation = await fetchSanityNavigation(lang);
  const group = navigation?.find((item: any) => {
    if (item.key) return item.key === keyOrTitle;
    return slugify(item.title ?? "") === keyOrTitle;
  });
  if (!group) return [];
  return group.links?.map((l: any) => applyResolvedHref(l, lang)) ?? [];
};
