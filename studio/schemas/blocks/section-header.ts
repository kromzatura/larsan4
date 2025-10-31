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
      name: "surface",
      type: "string",
      title: "Surface",
      description: "Choose a surface variant for this header",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Surface 1", value: "surface-1" },
        ],
        layout: "radio",
      },
      initialValue: "default",
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
      description:
        "Plain text description (legacy). Prefer the Rich Description field below for formatting.",
    }),
    defineField({
      name: "richDescription",
      type: "inline-rich-text",
      title: "Description (Rich Text)",
      description:
        "Supports bold, italic, and links. Use this instead of the plain description to preserve formatting.",
    }),
    defineField({
      name: "links",
      type: "array",
      of: [{ type: "link-icon" }],
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: "isDatasheetTitle",
      type: "boolean",
      title: "Display as Serif Datasheet Title",
      description:
        "Use for the main title of a comparison or datasheet-style page to apply serif styling and elevated visual weight.",
      initialValue: false,
    }),
    defineField({
      name: "hasGroupDivider",
      type: "boolean",
      title: "Display as Group Divider",
      description:
        "Adds a bottom border and padding for major section grouping (e.g., Box sections).",
      initialValue: false,
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
