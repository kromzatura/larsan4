import { defineField, defineType } from "sanity";
import { ICON_VARIANTS } from "../shared/icon-variants";

export default defineType({
  name: "link-icon",
  type: "object",
  title: "Link Icon",
  validation: (Rule) => [
    Rule.custom((value) => {
      if (!value) return true;
      const { isExternal, href, internalLink } = value as any;
      if (isExternal) {
        return href ? true : "External links require an href";
      }
      return internalLink
        ? true
        : "Select an internal link or mark as External";
    }),
    Rule.custom((value) => {
      if (!value) return true;
      const { isExternal, internalLink } = value as any;
      if (isExternal || !internalLink) return true;
      const hasSlug = Boolean(internalLink?.slug?.current);
      return hasSlug ? true : "missing-slug";
    }).warning("Selected document has no slug yet"),
  ],
  fields: [
    defineField({
      name: "iconVariant",
      type: "string",
      title: "Icon Variant",
      options: {
        list: ICON_VARIANTS.map(({ title, value }) => ({ title, value })),
      },
      initialValue: "none",
    }),
    defineField({
      name: "isExternal",
      type: "boolean",
      title: "Is External",
      initialValue: false,
    }),
    defineField({
      name: "internalLink",
      type: "reference",
      title: "Internal Link",
      to: [
        { type: "page" },
        { type: "post" },
        { type: "product" },
        { type: "productCategory" },
        { type: "contact" },
      ],
      hidden: ({ parent }) => parent?.isExternal,
    }),
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "description",
      type: "text",
      description: "The description of the link. Used for navigation items.",
    }),
    defineField({
      name: "href",
      title: "href",
      type: "url",
      hidden: ({ parent }) => !parent?.isExternal,
      validation: (Rule) =>
        Rule.uri({
          allowRelative: true,
          scheme: ["http", "https", "mailto", "tel"],
        }),
    }),
    defineField({
      name: "target",
      type: "boolean",
      title: "Open in new tab",
      hidden: ({ parent }) => !parent?.isExternal,
    }),
    defineField({
      name: "buttonVariant",
      type: "button-variant",
      title: "Button Variant",
    }),
  ],
  preview: {
    select: {
      isExternal: "isExternal",
      label: "title",
      href: "href",
      ilType: "internalLink._type",
      ilSlug: "internalLink.slug.current",
      ilTitle: "internalLink.title",
      iconVariant: "iconVariant",
    },
    prepare({ isExternal, label, href, ilType, ilSlug, ilTitle, iconVariant }) {
      const icon =
        iconVariant && iconVariant !== "none" ? ` • ${iconVariant}` : "";
      if (isExternal) {
        return {
          title: label || href || "External link",
          subtitle: `External${icon}`,
        };
      }
      const typeLabel =
        ilType === "post"
          ? "Post"
          : ilType === "category"
          ? "Blog Category"
          : ilType === "product"
          ? "Product"
          : ilType === "productCategory"
          ? "Product Category"
          : ilType === "page"
          ? "Page"
          : "Internal";
      const path =
        ilType === "post"
          ? `/blog/${ilSlug || ""}`
          : ilType === "category"
          ? `/blog/category/${ilSlug || ""}`
          : ilType === "product"
          ? `/products/${ilSlug || ""}`
          : ilType === "productCategory"
          ? `/products/category/${ilSlug || ""}`
          : ilType === "contact"
          ? `/contact`
          : ilSlug === "index"
          ? "/"
          : `/${ilSlug || ""}`;
      return {
        title: label || ilTitle || path || "Link",
        subtitle: `${typeLabel} • ${path}${icon}`,
      };
    },
  },
});
