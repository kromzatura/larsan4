import slugify from "./slugify";
import { fetchSanityNavigation } from "@/sanity/lib/fetch";
import { resolveHref } from "./resolveHref";

import type { ButtonVariant } from "@/sanity.types";

export type NavLink = {
  _key: string;
  _type: string;
  title?: string;
  href?: string | null;
  internalType?: string;
  internalSlug?: string;
  target?: boolean;
  buttonVariant?: ButtonVariant | null;
};

export interface NavGroup extends NavLink {
  _type: "link-group";
  links?: NavigationItem[];
}

export type NavigationItem = NavLink | NavGroup;

function isGroup(item: NavigationItem): item is NavGroup {
  return item._type === "link-group";
}

function applyResolvedHref(item: NavigationItem): NavigationItem {
  if (isGroup(item)) {
    const links = item.links?.map((link) => applyResolvedHref(link)) ?? [];
    return { ...item, links } as NavGroup;
  }

  if (item.internalType) {
    const computed = resolveHref(item.internalType, item.internalSlug ?? undefined);
    return { ...item, href: computed ?? item.href ?? null } as NavLink;
  }

  return item;
}

export const getNavigationItems = async (title: string) => {
  const navigation = await fetchSanityNavigation();
  const group = navigation?.find(
    (item) => slugify(item.title ?? "") === title
  );
  if (!group) return [];
  const links = group.links as NavigationItem[] | undefined;
  return links?.map((link) => applyResolvedHref(link)) ?? [];
};
