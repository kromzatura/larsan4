import { defineType, defineField } from "sanity";
import { DollarSign } from "lucide-react";

export default defineType({
  name: "pricing-16",
  type: "object",
  title: "Pricing 16",
  description:
    "Pricing 16: Pricing cards with grid layout split into 1-4 columns.",
  icon: DollarSign,
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
              name: "featured",
              type: "boolean",
              initialValue: false,
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
              name: "price",
              type: "object",
              fields: [
                defineField({
                  name: "value",
                  type: "number",
                }),
                defineField({
                  name: "discount",
                  type: "number",
                  description: "Discount percentage",
                }),
              ],
            }),
            defineField({
              name: "link",
              type: "link",
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
      validation: (Rule) => Rule.required().max(4),
    }),
  ],
  preview: {
    select: {
      title: "columns.0.title",
    },
    prepare({ title }) {
      return {
        title: "Pricing 16",
        subtitle: title || "No Title",
      };
    },
  },
});
