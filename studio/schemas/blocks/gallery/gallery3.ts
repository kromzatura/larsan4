import { defineType, defineField } from "sanity";
import { Images } from "lucide-react";
import image from "../shared/image";

export default defineType({
  name: "gallery-3",
  type: "object",
  title: "Gallery 3",
  description: "Gallery 3: Gallery with grid layout split into columns.",
  icon: Images,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "title",
      type: "string",
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
            image,
            defineField({
              name: "link",
              type: "link-icon",
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
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: "Gallery 3",
        subtitle: title || "No Title",
      };
    },
  },
});
