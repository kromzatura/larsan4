import { defineType, defineField } from "sanity";
import { SquareSplitHorizontal } from "lucide-react";

export default defineType({
  name: "feature-66",
  type: "object",
  title: "Feature 66",
  description:
    "Feature 66: Feature cards with grid layout split into 2 columns.",
  icon: SquareSplitHorizontal,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "columns",
      type: "array",
      of: [{ type: "feature-66-card" }],
    }),
  ],
  preview: {
    select: {
      title: "columns.0.link.title",
    },
    prepare({ title }) {
      return {
        title: "Feature 66",
        subtitle: title || "No Title",
      };
    },
  },
});
