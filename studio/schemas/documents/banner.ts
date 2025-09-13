import { defineField, defineType } from "sanity";
import { Info } from "lucide-react";

export default defineType({
  name: "banner",
  type: "document",
  title: "Banner",
  description: "A banner with a title, description, and links",
  icon: Info,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "link",
      type: "link",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: "Banner",
        subtitle: title,
      };
    },
  },
});
