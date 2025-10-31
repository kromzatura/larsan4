import { defineField, defineType } from "sanity";
import { TextQuote } from "lucide-react";
import { ICON_VARIANTS } from "../../shared/icon-variants";

export default defineType({
  name: "feature-15-card",
  type: "object",
  icon: TextQuote,
  title: "Feature 15 / 16 Card",
  description: "Feature card with icon, title, description",
  fields: [
    defineField({
      name: "iconVariant",
      type: "string",
      title: "Icon Variant",
      options: {
        list: ICON_VARIANTS.map(({ title, value }) => ({ title, value })),
      },
      initialValue: "none",
    }),
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "richDescription",
      title: "Description (Rich Text)",
      type: "inline-rich-text",
      description:
        "Prefer this for formatting (bold, italic, links). Legacy plain description remains as fallback.",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title || "No Title",
      };
    },
  },
});
