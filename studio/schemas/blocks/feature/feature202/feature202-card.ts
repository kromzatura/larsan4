import { defineField, defineType } from "sanity";
import { TextQuote } from "lucide-react";
import { ICON_VARIANTS } from "../../shared/icon-variants";
import image from "../../shared/image";

export default defineType({
  name: "feature-202-card",
  type: "object",
  icon: TextQuote,
  title: "Feature 202 Card",
  description:
    "Feature card with icon, title, description and image background",
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
    defineField({
      name: "link",
      type: "link",
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
