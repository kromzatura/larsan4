import { defineType, defineField } from "sanity";
import { Images } from "lucide-react";
import image from "../shared/image";

export default defineType({
  name: "gallery-1",
  type: "object",
  title: "Gallery 1",
  description: "Gallery 1: Gallery with grid layout split into columns.",
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
            defineField({
              name: "title",
              type: "string",
            }),
            image,
            defineField({
              name: "logo",
              title: "Logo",
              type: "image",
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: "alt",
                  type: "string",
                  title: "Alternative Text",
                },
              ],
            }),
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
        title: "Gallery 1",
        subtitle: title || "No Title",
      };
    },
  },
});
