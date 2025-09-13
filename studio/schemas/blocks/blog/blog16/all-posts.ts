import { defineField, defineType } from "sanity";
import { Newspaper } from "lucide-react";

export default defineType({
  name: "all-posts-16",
  type: "object",
  title: "All Blog Posts 16",
  description: "A list of all blog posts 7 with pagination",
  icon: Newspaper,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "All Posts 16",
      };
    },
  },
});
