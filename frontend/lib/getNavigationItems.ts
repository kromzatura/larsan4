import slugify from "./slugify";
import { fetchSanityNavigation } from "@/sanity/lib/fetch";

export const getNavigationItems = async (title: string) => {
  const navigation = await fetchSanityNavigation();
  return navigation?.find((item) => slugify(item.title ?? "") === title)?.links;
};
