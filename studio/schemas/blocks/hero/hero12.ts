import { defineField, defineType } from "sanity";
import { LayoutTemplate } from "lucide-react";

export default defineType({
  name: "hero-12",
  title: "Hero 12",
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
      name: "image",
      type: "image",
      description: "Logo or main image",
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
      name: "links",
      type: "array",
      of: [{ type: "link-icon" }],
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: "tagLine",
      type: "string",
      description: "Optional tagline shown above the tech logos",
    }),
    defineField({
      name: "techLogos",
      type: "array",
      title: "Technology Logos",
      description: "Logos of technologies used",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "image",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
              fields: [
                defineField({
                  name: "alt",
                  type: "string",
                  title: "Alternative text",
                }),
              ],
            }),
            defineField({
              name: "link",
              type: "link",
            }),
          ],
        },
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
        title: "Hero 12",
        subtitle: subtitle || title,
      };
    },
  },
});
