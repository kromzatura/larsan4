import { defineType, defineField } from "sanity";
import { CheckCircle } from "lucide-react";
import image from "../shared/image";

export default defineType({
  name: "compare-5",
  type: "object",
  title: "Compare 5",
  description: "Compare 5: Compare 2 columns with a list of features.",
  icon: CheckCircle,
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
              name: "title",
              type: "string",
            }),
            defineField({
              name: "description",
              type: "text",
            }),
            defineField({
              name: "link",
              type: "link",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().max(2),
    }),
  ],
  preview: {
    select: {
      title: "columns.0.title",
    },
    prepare({ title }) {
      return {
        title: "Compare 5",
        subtitle: title || "No Title",
      };
    },
  },
});
