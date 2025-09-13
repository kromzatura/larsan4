import { defineType, defineField } from "sanity";
import { Images } from "lucide-react";
import { ICON_VARIANTS } from "../shared/icon-variants";
import { COLOR_VARIANTS } from "../shared/color-variants";

export default defineType({
  name: "timeline-6",
  type: "object",
  title: "Timeline 6",
  description: "Timeline 6: Timeline section with scrollable timeline.",
  icon: Images,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "title",
      type: "object",
      description: "Title 2 is highlighted with an icon",
      fields: [
        defineField({
          name: "title1",
          type: "string",
        }),
        defineField({
          name: "title2",
          type: "string",
        }),
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
          name: "color",
          title: "Color",
          type: "string",
          options: {
            list: COLOR_VARIANTS.map(({ title, value }) => ({ title, value })),
          },
          description: "The color of the icon.",
        }),
        defineField({
          name: "title3",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "columns",
      type: "array",
      of: [
        {
          name: "column",
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
            defineField({
              name: "description",
              type: "text",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title1: "title.title1",
      title2: "title.title2",
      title3: "title.title3",
    },
    prepare({ title1, title2, title3 }) {
      return {
        title: "Timeline 5",
        subtitle: `${title1} ${title2} ${title3}`,
      };
    },
  },
});
