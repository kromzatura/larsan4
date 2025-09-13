import { defineType, defineField } from "sanity";
import { DollarSign } from "lucide-react";

export default defineType({
  name: "pricing-9",
  type: "object",
  title: "Pricing 9",
  description:
    "Pricing 9: Pricing cards with table like layout split into 4 columns.",
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
              options: {
                list: [
                  { title: "Free", value: "free" },
                  { title: "Pro", value: "pro" },
                  { title: "Premium", value: "premium" },
                ],
              },
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
              type: "link",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().max(3),
    }),
    defineField({
      name: "sections",
      type: "array",
      of: [
        defineField({
          name: "section",
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
            }),
            defineField({
              name: "features",
              type: "array",
              of: [
                {
                  name: "feature",
                  type: "object",
                  fields: [
                    defineField({
                      name: "name",
                      type: "string",
                    }),
                    defineField({
                      name: "tiers",
                      type: "object",
                      fields: [
                        defineField({
                          name: "free",
                          type: "boolean",
                          initialValue: false,
                        }),
                        defineField({
                          name: "pro",
                          type: "boolean",
                          initialValue: false,
                        }),
                        defineField({
                          name: "premium",
                          type: "boolean",
                          initialValue: false,
                        }),
                      ],
                    }),
                    defineField({
                      name: "tooltip",
                      type: "string",
                    }),
                  ],
                },
              ],
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "columns.0.title",
    },
    prepare({ title }) {
      return {
        title: "Pricing 9",
        subtitle: title || "No Title",
      };
    },
  },
});
