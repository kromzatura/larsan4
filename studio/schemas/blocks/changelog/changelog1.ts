import { defineField, defineType } from "sanity";
import { FileClock } from "lucide-react";

export default defineType({
  name: "changelog-1",
  type: "object",
  title: "Changelog 1",
  description: "A list of all changelogs 1",
  icon: FileClock,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Changelog 1",
      };
    },
  },
});
