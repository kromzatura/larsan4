import { defineType, defineField } from "sanity";
import { FileText } from "lucide-react";
import { COLS_VARIANTS } from "../../shared/col-variants";

export default defineType({
  name: "blog-14",
  type: "object",
  title: "Blog 14 Featured",
  description:
    "Blog 14: Blog posts with a first post as featured post and the rest split into 2/3 columns.",
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
      name: "title",
      type: "string",
      title: "Title",
      description: "The title of the popular posts section",
      initialValue: "Popular Posts",
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
        title: "Blog 14 Featured",
        subtitle: title || "No Title",
      };
    },
  },
});
