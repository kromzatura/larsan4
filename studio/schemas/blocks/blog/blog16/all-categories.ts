import { defineType, defineField } from "sanity";

export default defineType({
  name: "all-categories-16",
  type: "object",
  title: "All Categories 16",
  fields: [
    defineField({ name: "padding", type: "section-padding" }),
  ],
  preview: {
    prepare: () => ({
      title: "All Categories",
      subtitle: "Blog 16",
    }),
  },
});
