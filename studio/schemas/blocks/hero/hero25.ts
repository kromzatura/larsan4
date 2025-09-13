import { defineField, defineType } from "sanity";
import { LayoutTemplate } from "lucide-react";
import { ICON_VARIANTS } from "../shared/icon-variants";
import image from "../shared/image";

export default defineType({
  name: "hero-25",
  title: "Hero 25",
  type: "object",
  icon: LayoutTemplate,
  fields: [
    defineField({
      ...image,
      description: "Logo or main image",
    }),
    defineField({
      name: "tagLine",
      type: "string",
    }),
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "links",
      type: "array",
      of: [{ type: "link-icon" }],
      validation: (Rule) => Rule.max(2),
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
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "tagLine",
    },
    prepare({ title, subtitle }) {
      return {
        title: "Hero 25",
        subtitle: subtitle || title,
      };
    },
  },
});
