import { defineField, defineType } from "sanity";
import { Newspaper } from "lucide-react";

export default defineType({
  name: "all-posts-4",
  type: "object",
  title: "All Blog Posts 4",
  description: "A list of all blog posts 4 with pagination",
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
        title: "All Posts 4",
      };
    },
  },
});
