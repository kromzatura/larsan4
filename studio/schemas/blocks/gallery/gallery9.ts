import { defineType, defineField } from "sanity";
import { Images } from "lucide-react";
import { ICON_VARIANTS } from "../shared/icon-variants";
import image from "../shared/image";

export default defineType({
  name: "gallery-9",
  type: "object",
  title: "Gallery 9",
  description: "Gallery 9: Gallery with grid layout split into columns.",
  icon: Images,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "columns",
      type: "array",
      of: [
        {
          name: "column",
          type: "object",
          fields: [
            image,
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
      validation: (Rule) => Rule.required().max(3),
    }),
  ],
  preview: {
    select: {
      title: "columns.0.title",
    },
    prepare({ title }) {
      return {
        title: "Gallery 8",
        subtitle: title || "No Title",
      };
    },
  },
});
