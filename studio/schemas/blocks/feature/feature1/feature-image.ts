import { defineType } from "sanity";
import { Image } from "lucide-react";
import image from "../../shared/image";

export default defineType({
  name: "feature-image",
  type: "object",
  icon: Image,
  description: "Column with full image.",
  fields: [image],
  preview: {
    select: {
      title: "image.alt",
    },
    prepare({ title }) {
      return {
        title: title || "No Title",
      };
    },
  },
});
