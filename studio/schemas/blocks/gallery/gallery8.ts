import { defineType, defineField } from "sanity";
import { Images } from "lucide-react";
import image from "../shared/image";

export default defineType({
  name: "gallery-8",
  type: "object",
  title: "Gallery 8",
  description: "Gallery 8: Gallery with grid layout split into columns.",
  icon: Images,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "link",
      type: "link",
      description: "Link to all gallery resources",
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
              name: "link",
              type: "link",
            }),
            defineField({
              name: "categories",
              title: "Categories",
              type: "array",
              of: [{ type: "reference", to: { type: "category" } }],
            }),
          ],
          preview: {
            select: {
              title: "link.title",
            },
            prepare({ title }) {
              return {
                title,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "columns.0.link.title",
    },
    prepare({ title }) {
      return {
        title: "Gallery 8",
        subtitle: title || "No Title",
      };
    },
  },
});
