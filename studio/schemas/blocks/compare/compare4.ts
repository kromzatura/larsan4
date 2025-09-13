import { defineType, defineField } from "sanity";
import { CheckCircle } from "lucide-react";

export default defineType({
  name: "compare-4",
  type: "object",
  title: "Compare 4",
  description: "Compare 4: Compare table with 2 columns.",
  icon: CheckCircle,
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
      name: "titles",
      type: "object",
      fields: [
        defineField({
          name: "primary",
          type: "string",
        }),
        defineField({
          name: "secondary",
          type: "string",
        }),
      ],
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
              name: "primary",
              type: "object",
              fields: [
                defineField({
                  name: "value",
                  type: "string",
                }),
                defineField({
                  name: "unit",
                  type: "string",
                }),
                defineField({
                  name: "description",
                  type: "text",
                }),
              ],
            }),
            defineField({
              name: "secondary",
              type: "object",
              fields: [
                defineField({
                  name: "value",
                  type: "string",
                }),
                defineField({
                  name: "unit",
                  type: "string",
                }),
                defineField({
                  name: "description",
                  type: "text",
                }),
              ],
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      type: "block-content",
      description: "Used for notes on the table",
    }),
    defineField({
      name: "links",
      type: "array",
      of: [{ type: "link-icon" }],
      validation: (Rule) => Rule.max(2),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: "Compare 4",
        subtitle: title || "No Title",
      };
    },
  },
});
