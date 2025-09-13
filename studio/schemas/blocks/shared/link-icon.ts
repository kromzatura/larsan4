import { defineField, defineType } from "sanity";
import { ICON_VARIANTS } from "../shared/icon-variants";

export default defineType({
  name: "link-icon",
  type: "object",
  title: "Link Icon",
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
      to: [{ type: "page" }, { type: "post" }],
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
});
