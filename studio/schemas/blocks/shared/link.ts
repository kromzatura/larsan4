import { defineField, defineType } from "sanity";

export default defineType({
  name: "link",
  type: "object",
  title: "Link",
  fields: [
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
      ],
      hidden: ({ parent }) => parent?.isExternal,
    }),
    defineField({
      name: "title",
      type: "string",
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
      initialValue: false,
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
    },
    prepare({ isExternal, label, href, ilType, ilSlug, ilTitle }) {
      if (isExternal) {
        return {
          title: label || href || "External link",
          subtitle: "External",
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
      const path = ilType === "post"
        ? `/blog/${ilSlug || ""}`
        : ilType === "category"
        ? `/blog/category/${ilSlug || ""}`
        : ilType === "product"
        ? `/products/${ilSlug || ""}`
        : ilType === "productCategory"
        ? `/products/category/${ilSlug || ""}`
        : ilSlug === "index"
        ? "/"
        : `/${ilSlug || ""}`;
      return {
        title: label || ilTitle || path || "Link",
        subtitle: `${typeLabel} • ${path}`,
      };
    },
  },
});
