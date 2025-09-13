import { defineField, defineType } from "sanity";
import { LayoutTemplate } from "lucide-react";

export default defineType({
  name: "hero-174",
  title: "Hero 174",
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
      name: "tag",
      type: "object",
      description: "Tag shown in the bottom left of the hero",
      fields: [
        defineField({
          name: "title",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "description",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "tagLine",
    },
    prepare({ title, subtitle }) {
      return {
        title: "Hero 174",
        subtitle: subtitle || title,
      };
    },
  },
});
