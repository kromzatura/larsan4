import { defineField, defineType } from "sanity";
import { Tags } from "lucide-react";

export default defineType({
  name: "product-categories-16",
  type: "object",
  title: "Product Categories 16",
  description: "Interactive category chips for filtering/navigation",
  icon: Tags,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Product Categories 16" };
    },
  },
});
