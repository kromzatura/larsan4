import { defineType, defineField } from "sanity";
import { CheckCircle } from "lucide-react";
import image from "../shared/image";

export default defineType({
  name: "compare-2",
  type: "object",
  title: "Compare 2",
  description:
    "Compare 2: Compare cards with grid layout split into 1-4 columns.",
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
            defineField({
              name: "featured",
              type: "boolean",
              initialValue: false,
            }),
            image,
            defineField({
              name: "title",
              type: "string",
            }),
            defineField({
              name: "list",
              type: "array",
              of: [
                {
                  name: "item",
                  type: "object",
                  fields: [
                    defineField({
                      name: "title",
                      type: "string",
                    }),
                    defineField({
                      name: "isMissing",
                      type: "boolean",
                      initialValue: false,
                    }),
                  ],
                },
              ],
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().max(4),
    }),
  ],
  preview: {
    select: {
      title: "columns.0.title",
    },
    prepare({ title }) {
      return {
        title: "Compare 2",
        subtitle: title || "No Title",
      };
    },
  },
});
