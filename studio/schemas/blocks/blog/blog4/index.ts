import { defineType, defineField } from "sanity";
import { FileText } from "lucide-react";
import { COLS_VARIANTS } from "../../shared/col-variants";

export default defineType({
  name: "blog-4",
  type: "object",
  title: "Blog 4 Featured",
  description: "Blog 4: Blog posts with grid layout split into 2/3 columns.",
  icon: FileText,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "gridColumns",
      type: "string",
      title: "Grid Columns",
      options: {
        list: COLS_VARIANTS.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "grid-cols-2",
    }),
    defineField({
      name: "posts",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "post" }],
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(6),
    }),
  ],
  preview: {
    select: {
      title: "posts.0.title",
    },
    prepare({ title }) {
      return {
        title: "Blog 4 Featured",
        subtitle: title || "No Title",
      };
    },
  },
});
