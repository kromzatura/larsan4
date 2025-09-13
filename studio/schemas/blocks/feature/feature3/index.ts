import { defineType, defineField } from "sanity";
import { SquareSplitHorizontal } from "lucide-react";

export default defineType({
  name: "feature-3",
  type: "object",
  title: "Feature 3",
  description:
    "Feature 3: Feature cards with grid layout split into 3 columns.",
  icon: SquareSplitHorizontal,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "columns",
      type: "array",
      of: [{ type: "feature-3-card" }],
    }),
  ],
  preview: {
    select: {
      title: "columns.0.title",
    },
    prepare({ title }) {
      return {
        title: "Feature 3",
        subtitle: title || "No Title",
      };
    },
  },
});
