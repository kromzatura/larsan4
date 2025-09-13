import { defineField, defineType } from "sanity";
import { FileClock } from "lucide-react";

export default defineType({
  name: "changelog-5",
  type: "object",
  title: "Changelog 5",
  description: "A list of all changelogs 5",
  icon: FileClock,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "secondaryTitle",
      type: "string",
      title: "Secondary Title",
    }),
    defineField({
      name: "links",
      type: "array",
      title: "Links",
      of: [{ type: "link" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: "Changelog 5",
        subtitle: title,
      };
    },
  },
});
