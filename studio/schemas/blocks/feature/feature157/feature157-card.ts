import { defineField, defineType } from "sanity";
import { TextQuote } from "lucide-react";
import image from "../../shared/image";

export default defineType({
  name: "feature-157-card",
  type: "object",
  icon: TextQuote,
  title: "Feature 157 Card",
  description:
    "Feature card with link, title, description, and image background",
  fields: [
    image,
    defineField({
      name: "link",
      type: "link-icon",
    }),
  ],
  preview: {
    select: {
      title: "link.title",
    },
    prepare({ title }) {
      return {
        title: title || "No Title",
      };
    },
  },
});
