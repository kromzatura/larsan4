import { defineField, defineType } from "sanity";
import { Newspaper } from "lucide-react";

export default defineType({
  name: "all-posts-14",
  type: "object",
  title: "All Blog Posts 14",
  description: "A list of all blog posts 14 with pagination",
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
        title: "All Posts 14",
      };
    },
  },
});
