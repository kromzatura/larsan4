import { defineType, defineField } from "sanity";
import { SquareSplitHorizontal } from "lucide-react";
import { COLS_VARIANTS } from "../../shared/col-variants";

export default defineType({
  name: "feature-15",
  type: "object",
  title: "Feature 15 / 16",
  description:
    "Feature 15/16: Feature cards with grid layout split into 2/3 columns.",
  icon: SquareSplitHorizontal,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "gridColumns",
      type: "string",
      title: "Grid Columns",
      options: {
        list: COLS_VARIANTS.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "grid-cols-2",
    }),
    defineField({
      name: "columns",
      type: "array",
      of: [{ type: "feature-15-card" }],
    }),
  ],
  preview: {
    select: {
      title: "columns.0.title",
    },
    prepare({ title }) {
      return {
        title: "Feature 15 / 16",
        subtitle: title || "No Title",
      };
    },
  },
});
