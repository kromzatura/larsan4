import { defineType, defineField } from "sanity";
import { Images } from "lucide-react";
import image from "../shared/image";

export default defineType({
  name: "timeline-3",
  type: "object",
  title: "Timeline 3",
  description: "Timeline 3: Timeline section with scrollable timeline.",
  icon: Images,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
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
      name: "links",
      type: "array",
      of: [{ type: "link-icon" }],
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: "columns",
      type: "array",
      of: [
        {
          name: "column",
          type: "object",
          fields: [
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
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: "Timeline 3",
        subtitle: title || "No Title",
      };
    },
  },
});
