import { defineType, defineField } from "sanity";
import { FileText } from "lucide-react";

export default defineType({
  name: "blog-16",
  type: "object",
  title: "Blog 16 Featured",
  description: "Blog 16: Blog posts with list layout.",
  icon: FileText,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
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
        title: "Blog 16 Featured",
        subtitle: title || "No Title",
      };
    },
  },
});
