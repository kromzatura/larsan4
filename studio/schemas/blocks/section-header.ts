import { defineField, defineType } from "sanity";
import { LetterText } from "lucide-react";
import {
  STACK_ALIGN,
  SECTION_WIDTH,
  DIRECTION_VARIANTS,
} from "./shared/layout-variants";

export default defineType({
  name: "section-header",
  type: "object",
  title: "Section Header",
  description: "A section header with a tag line, title, and description",
  icon: LetterText,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "sectionWidth",
      type: "string",
      title: "Section Width",
      options: {
        list: SECTION_WIDTH.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "default",
    }),
    defineField({
      name: "stackAlign",
      type: "string",
      title: "Stack Layout Alignment",
      options: {
        list: STACK_ALIGN.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "left",
    }),
    defineField({
      name: "direction",
      type: "string",
      title: "Direction",
      description:
        "The layout direction between the section header content and links on desktop",
      options: {
        list: DIRECTION_VARIANTS.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "column",
      hidden: ({ parent }) => parent?.sectionWidth === "narrow",
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
      type: "object",
      fields: [
        defineField({
          name: "text",
          type: "string",
        }),
        defineField({
          name: "element",
          type: "string",
          options: {
            list: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "div"],
          },
          initialValue: "h2",
        }),
        defineField({
          name: "size",
          type: "string",
          options: {
            list: ["small", "default", "large"],
          },
          initialValue: "default",
        }),
        defineField({
          name: "weight",
          type: "string",
          options: {
            list: ["normal", "medium", "semibold", "bold"],
          },
          initialValue: "bold",
        }),
      ],
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "links",
      type: "array",
      of: [{ type: "link-icon" }],
      validation: (Rule) => Rule.max(2),
    }),
  ],
  preview: {
    select: {
      title: "title.text",
    },
    prepare({ title }) {
      return {
        title: "Section Header",
        subtitle: title,
      };
    },
  },
});
