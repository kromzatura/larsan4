import { defineType, defineField } from "sanity";
import { Images } from "lucide-react";
import image from "../shared/image";

export default defineType({
  name: "logos-4",
  type: "object",
  icon: Images,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "images",
      type: "array",
      of: [image],
    }),
  ],
  preview: {
    select: {
      title: "images.0.alt",
    },
    prepare({ title }) {
      return {
        title: "Logos 4",
        subtitle: title || "No Title",
      };
    },
  },
});
