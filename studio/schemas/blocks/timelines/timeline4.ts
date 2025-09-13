import { defineType, defineField } from "sanity";
import { Images } from "lucide-react";
import { ICON_VARIANTS } from "../shared/icon-variants";
import image from "../shared/image";

export default defineType({
  name: "timeline-4",
  type: "object",
  title: "Timeline 4",
  description:
    "Timeline 4: Timeline section with alternating text and image layout.",
  icon: Images,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "tag",
      type: "object",
      fields: [
        defineField({
          name: "text",
          type: "string",
        }),
        defineField({
          name: "type",
          type: "string",
          options: {
            list: ["title", "badge"],
          },
          initialValue: "title",
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
          hidden: ({ parent }) => parent?.type !== "badge",
        }),
      ],
    }),
    defineField({
      name: "title",
      type: "string",
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
              name: "title",
              type: "string",
            }),
            defineField({
              name: "description",
              type: "text",
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
            image,
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: "Timeline 4",
        subtitle: title || "No Title",
      };
    },
  },
});
