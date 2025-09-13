import { defineType, defineField } from "sanity";
import { Images } from "lucide-react";

export default defineType({
  name: "gallery-10",
  type: "object",
  title: "Gallery 10",
  description: "Gallery 10: Gallery with grid layout split into columns.",
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
      name: "testimonials",
      type: "array",
      of: [
        defineField({
          name: "testimonial",
          type: "reference",
          to: [{ type: "testimonial" }],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "testimonials.0.name",
    },
    prepare({ title }) {
      return {
        title: "Gallery 10",
        subtitle: title || "No Title",
      };
    },
  },
});
