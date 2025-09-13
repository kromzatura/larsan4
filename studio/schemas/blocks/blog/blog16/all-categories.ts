import { defineField, defineType } from "sanity";
import { Tags } from "lucide-react";

export default defineType({
  name: "all-categories-16",
  type: "object",
  title: "All Categories 16",
  description: "List all blog categories as links/chips.",
  icon: Tags,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "All Categories 16",
      };
    },
  },
});
