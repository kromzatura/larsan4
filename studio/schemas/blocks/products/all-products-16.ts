import { defineField, defineType } from "sanity";
import { ShoppingCart } from "lucide-react";

export default defineType({
  name: "all-products-16",
  type: "object",
  title: "All Products 16",
  description: "Paginated table of products with inquiry actions",
  icon: ShoppingCart,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
  ],
  preview: {
    prepare() {
      return { title: "All Products 16" };
    },
  },
});
