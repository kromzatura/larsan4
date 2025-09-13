import { defineField, defineType } from "sanity";
import { TextQuote } from "lucide-react";
import { ICON_VARIANTS } from "../../shared/icon-variants";

export default defineType({
  name: "feature-content",
  type: "object",
  icon: TextQuote,
  title: "Feature Content",
  description: "Column with tag line, title and content body.",
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
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
      name: "tag",
      type: "object",
      fields: [
        defineField({
          name: "text",
          type: "string",
        }),
        defineField({
          name: "type",
          type: "string",
          options: {
            list: ["title", "badge"],
          },
          initialValue: "title",
        }),
      ],
    }),
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "body",
      type: "block-content",
    }),
    defineField({
      name: "links",
      type: "array",
      of: [{ type: "link" }],
      validation: (Rule) => Rule.max(2),
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
