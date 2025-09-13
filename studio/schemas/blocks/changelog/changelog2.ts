import { defineField, defineType } from "sanity";
import { FileClock } from "lucide-react";

export default defineType({
  name: "changelog-2",
  type: "object",
  title: "Changelog 2",
  description: "A list of all changelogs 2",
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
        title: "Changelog 2",
      };
    },
  },
});
