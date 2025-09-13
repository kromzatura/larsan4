import { defineField, defineType } from "sanity";
import { TextQuote } from "lucide-react";
import { ICON_VARIANTS } from "../../shared/icon-variants";
import image from "../../shared/image";

export default defineType({
  name: "feature-3-card",
  type: "object",
  icon: TextQuote,
  title: "Feature 3 Card",
  description: "Feature card with icon, title, description and image.",
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
    image,
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
