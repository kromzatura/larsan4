import { defineField, defineType } from "sanity";
import { ImagePlus } from "lucide-react";

export default defineType({
  name: "image-treatment",
  title: "Image Treatment",
  type: "object",
  icon: ImagePlus,
  fields: [
    defineField({
      name: "treatment",
      type: "string",
      title: "Treatment",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "Dark 30%", value: "dark-30" },
          { title: "Dark 50%", value: "dark-50" },
          { title: "Brand Gradient", value: "brand-gradient" },
        ],
        layout: "radio",
      },
      initialValue: "none",
    }),
    defineField({
      name: "grayscale",
      type: "string",
      title: "Grayscale",
      description: "Apply grayscale filter to the image (Feature 202 uses hover to reduce).",
      options: {
        list: [
          { title: "Off", value: "off" },
          { title: "On", value: "on" },
        ],
        layout: "radio",
      },
      initialValue: "off",
    }),
  ],
  preview: {
    select: { title: "treatment", grayscale: "grayscale" },
    prepare({ title, grayscale }) {
      const g = grayscale === "on" ? " + grayscale" : "";
      return { title: title ? `Treatment: ${title}${g}` : `Treatment: none${g}` };
    },
  },
});
