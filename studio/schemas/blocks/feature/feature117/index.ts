import { defineType, defineField } from "sanity";
import { SquareSplitHorizontal } from "lucide-react";

export default defineType({
  name: "feature-117",
  type: "object",
  title: "Feature 117",
  description:
    "Feature 117: Feature cards with grid layout split into 3 columns.",
  icon: SquareSplitHorizontal,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "columns",
      type: "array",
      of: [{ type: "feature-117-card" }],
    }),
  ],
  preview: {
    select: {
      title: "columns.0.title",
    },
    prepare({ title }) {
      return {
        title: "Feature 117",
        subtitle: title || "No Title",
      };
    },
  },
});
