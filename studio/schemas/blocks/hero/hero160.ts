import { defineField, defineType } from "sanity";
import { LayoutTemplate } from "lucide-react";
import { ICON_VARIANTS } from "../shared/icon-variants";
import image from "../shared/image";

export default defineType({
  name: "hero-160",
  title: "Hero 160",
  type: "object",
  icon: LayoutTemplate,
  fields: [
    defineField({
      name: "backgroundImage",
      type: "image",
      description: "Background image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
        }),
      ],
    }),
    defineField({
      name: "tag",
      type: "object",
      description: "Tag with icon and text",
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
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      type: "block-content",
      description: "Main content area supporting rich text",
    }),
    defineField({
      name: "links",
      type: "array",
      of: [{ type: "link-icon" }],
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      ...image,
      description: "Main image",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "tagLine",
    },
    prepare({ title, subtitle }) {
      return {
        title: "Hero 160",
        subtitle: subtitle || title,
      };
    },
  },
});
