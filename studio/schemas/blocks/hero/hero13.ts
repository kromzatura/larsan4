import { defineField, defineType } from "sanity";
import { LayoutTemplate } from "lucide-react";
import { ICON_VARIANTS } from "../shared/icon-variants";

export default defineType({
  name: "hero-13",
  title: "Hero 13",
  type: "object",
  icon: LayoutTemplate,
  fields: [
    defineField({
      name: "tag",
      type: "object",
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
          name: "title",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      type: "block-content",
      description: "Main content area supporting rich text",
    }),
    defineField({
      name: "links",
      type: "array",
      of: [{ type: "link-icon" }],
      validation: (Rule) => Rule.max(2),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "tagLine",
    },
    prepare({ title, subtitle }) {
      return {
        title: "Hero 13",
        subtitle: subtitle || title,
      };
    },
  },
});
