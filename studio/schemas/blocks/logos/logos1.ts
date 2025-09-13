import { defineType, defineField } from "sanity";
import { Images } from "lucide-react";
import image from "../shared/image";

export default defineType({
  name: "logos-1",
  type: "object",
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
      name: "images",
      type: "array",
      of: [image],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: "Logos 1",
        subtitle: title || "No Title",
      };
    },
  },
});
