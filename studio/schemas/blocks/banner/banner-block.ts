import { defineField, defineType } from "sanity";
import { Info } from "lucide-react";

export default defineType({
  name: "banner-block",
  type: "object",
  title: "Banner",
  icon: Info,
  fields: [
    defineField({ name: "padding", type: "section-padding" }),
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "description",
      title: "Description",
      type: "inline-rich-text",
      description: "Short rich text description (supports bold, italic, links)",
    }),
    defineField({ name: "link", type: "link" }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: "Banner", subtitle: title };
    },
  },
});
