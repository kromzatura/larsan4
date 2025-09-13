import { defineType, defineField } from "sanity";
import { SquareSplitHorizontal } from "lucide-react";

export default defineType({
  name: "feature-12",
  type: "object",
  title: "Feature 12",
  description: "Feature 12: Feature cards with grid cards and slider.",
  icon: SquareSplitHorizontal,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "tagline",
      type: "string",
      title: "Tagline",
    }),
    defineField({
      name: "columns",
      type: "array",
      of: [{ type: "feature-12-card" }],
    }),
  ],
  preview: {
    select: {
      title: "columns.0.title",
    },
    prepare({ title }) {
      return {
        title: "Feature 12",
        subtitle: title || "No Title",
      };
    },
  },
});
