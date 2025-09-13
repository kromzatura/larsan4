import { defineType, defineField } from "sanity";
import { DollarSign } from "lucide-react";

export default defineType({
  name: "pricing-2",
  type: "object",
  title: "Pricing 2",
  description:
    "Pricing 2: Pricing cards with grid layout split into 1-3 columns.",
  icon: DollarSign,
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
            defineField({
              name: "description",
              type: "text",
            }),
            defineField({
              name: "price",
              type: "object",
              fields: [
                defineField({
                  name: "monthly",
                  type: "number",
                }),
                defineField({
                  name: "yearly",
                  type: "number",
                }),
              ],
            }),
            defineField({
              name: "link",
              type: "link-icon",
            }),
            defineField({
              name: "listTitle",
              type: "string",
            }),
            defineField({
              name: "list",
              type: "array",
              of: [{ type: "string" }],
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
        title: "Pricing 2",
        subtitle: title || "No Title",
      };
    },
  },
});
