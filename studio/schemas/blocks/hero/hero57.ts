import { defineField, defineType } from "sanity";
import { LayoutTemplate } from "lucide-react";
import { ICON_VARIANTS } from "../shared/icon-variants";

export default defineType({
  name: "hero-57",
  title: "Hero 57",
  type: "object",
  icon: LayoutTemplate,
  fields: [
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
      validation: (Rule) => Rule.max(1),
    }),
    defineField({
      name: "tags",
      type: "array",
      of: [
        {
          name: "tag",
          type: "object",
          fields: [
            defineField({
              name: "iconVariant",
              type: "string",
              title: "Icon Variant",
              options: {
                list: ICON_VARIANTS.map(({ title, value }) => ({
                  title,
                  value,
                })),
              },
              initialValue: "none",
            }),
            defineField({
              name: "title",
              type: "string",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "tagLine",
    },
    prepare({ title, subtitle }) {
      return {
        title: "Hero 57",
        subtitle: subtitle || title,
      };
    },
  },
});
