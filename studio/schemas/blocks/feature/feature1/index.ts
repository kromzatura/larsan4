import { defineType, defineField } from "sanity";
import { SquareSplitHorizontal } from "lucide-react";

export default defineType({
  name: "feature-1",
  type: "object",
  title: "Feature 1 / 2 / 6 / 7",
  description: "Feature 1: Feature with split columns.",
  icon: SquareSplitHorizontal,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "columns",
      type: "array",
      of: [{ type: "feature-content" }, { type: "feature-image" }],
      validation: (rule) => rule.max(2),
      options: {
        insertMenu: {
          views: [
            {
              name: "grid",
              previewImageUrl: (block) => `/sanity/preview/${block}.jpg`,
            },
            { name: "list" },
          ],
        },
      },
    }),
  ],
  preview: {
    select: {
      title0: "columns.0.title",
      title1: "columns.1.title",
    },
    prepare({ title0, title1 }) {
      return {
        title: "Feature 1 / 2 / 6 / 7",
        subtitle: title0 || title1 || "No Title",
      };
    },
  },
});
