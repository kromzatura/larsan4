import slugify from "./slugify";
import { fetchSanityNavigation } from "@/sanity/lib/fetch";
import { resolveHref } from "./resolveHref";

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

function applyResolvedHref<T extends NavLink | NavGroup>(item: T): T {
  if (isGroup(item)) {
    const links = item.links?.map((l) => applyResolvedHref(l as any)) ?? [];
    return { ...(item as any), links } as T;
  }
  if (item.internalType && item.internalSlug) {
    const computed = resolveHref(item.internalType, item.internalSlug);
    return { ...(item as any), href: computed ?? item.href ?? null } as T;
  }
  return item;
}

export const getNavigationItems = async (title: string) => {
  const navigation = await fetchSanityNavigation();
  const group = navigation?.find(
    (item) => slugify(item.title ?? "") === title
  );
  if (!group) return [];
  return group.links?.map((l: any) => applyResolvedHref(l)) ?? [];
};
