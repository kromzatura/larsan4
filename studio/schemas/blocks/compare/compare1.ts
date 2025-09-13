import { defineType, defineField } from "sanity";
import { CheckCircle } from "lucide-react";
import image from "../shared/image";

export default defineType({
  name: "compare-1",
  type: "object",
  title: "Compare 1",
  description: "Compare 1: Compare 2 columns with a list of features.",
  icon: CheckCircle,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "images",
      type: "array",
      of: [image],
      validation: (Rule) => Rule.required().max(2),
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
              name: "label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "primary",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "secondary",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "hasIcon",
              type: "boolean",
              initialValue: false,
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "columns.0.label",
    },
    prepare({ title }) {
      return {
        title: "Compare 1",
        subtitle: title || "No Title",
      };
    },
  },
});
