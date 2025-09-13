import { defineType, defineField } from "sanity";
import { CheckCircle } from "lucide-react";

export default defineType({
  name: "compare-6",
  type: "object",
  title: "Compare 6",
  description: "Compare 6: Compare table with 2-4 columns.",
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
      name: "rows",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required(),
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
              name: "name",
              type: "string",
            }),
            defineField({
              name: "attributes",
              type: "array",
              of: [
                {
                  name: "item",
                  type: "object",
                  fields: [
                    defineField({
                      name: "value",
                      type: "string",
                    }),
                    defineField({
                      name: "status",
                      type: "string",
                      options: {
                        list: ["neutral", "positive", "negative"],
                      },
                      initialValue: "neutral",
                    }),
                  ],
                },
              ],
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(2).max(4),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: "Compare 6",
        subtitle: title || "No Title",
      };
    },
  },
});
