import { defineType, defineField } from "sanity";
import { SquareSplitHorizontal } from "lucide-react";

export default defineType({
  name: "feature-157",
  type: "object",
  title: "Feature 157",
  description:
    "Feature 157: Feature cards with grid layout split into 2 columns.",
  icon: SquareSplitHorizontal,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "columns",
      type: "array",
      of: [{ type: "feature-157-card" }],
    }),
  ],
  preview: {
    select: {
      title: "columns.0.link.title",
    },
    prepare({ title }) {
      return {
        title: "Feature 157",
        subtitle: title || "No Title",
      };
    },
  },
});
