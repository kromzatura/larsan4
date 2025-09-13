import { defineField, defineType } from "sanity";

export default defineType({
  name: "link-group",
  type: "object",
  title: "Link Group",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "The title of the group that will be displayed",
    }),
    defineField({
      name: "links",
      type: "array",
      of: [{ type: "link-icon" }],
    }),
  ],
});
