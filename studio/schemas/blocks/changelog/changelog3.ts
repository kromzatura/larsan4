import { defineField, defineType } from "sanity";
import { FileClock } from "lucide-react";

export default defineType({
  name: "changelog-3",
  type: "object",
  title: "Changelog 3",
  description: "A list of all changelogs 3",
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
        title: "Changelog 3",
      };
    },
  },
});
