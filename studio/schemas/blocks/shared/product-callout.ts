import { defineField, defineType } from "sanity";
import { PackageOpen } from "lucide-react";

export default defineType({
  name: "product-callout",
  title: "Product Callout",
  type: "object",
  icon: PackageOpen,
  description:
    "Highlight a product inside article content with an image, title and CTA.",
  fields: [
    defineField({
      name: "product",
      type: "reference",
      title: "Product",
      to: [{ type: "product" }],
      validation: (rule) =>
        rule.required().error("Select a product to feature"),
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Override Title",
      description: "Optional: override the product title shown in the callout",
    }),
    defineField({
      name: "blurb",
      type: "text",
      title: "Blurb",
      description: "Optional: short description below the title",
      rows: 3,
      validation: (rule) =>
        rule.max(240).warning("Keep the blurb concise (≤ 240 characters)"),
    }),
    defineField({
      name: "ctaLabel",
      type: "string",
      title: "CTA Label",
      description:
        "Button label linking to the product page (defaults to 'View product')",
    }),
    defineField({
      name: "align",
      type: "string",
      title: "Alignment",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
        ],
        layout: "radio",
      },
      initialValue: "left",
    }),
    defineField({
      name: "showImage",
      type: "boolean",
      title: "Show Image",
      initialValue: true,
      description: "Disable to hide the product image in the card",
    }),
  ],
  preview: {
    select: {
      title: "title",
      productTitle: "product->title",
    },
    prepare({ title, productTitle }) {
      return {
        title: "Product Callout",
        subtitle: title || productTitle || "(select a product)",
      };
    },
  },
});
