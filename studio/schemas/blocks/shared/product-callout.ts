import { defineField, defineType } from "sanity";
import { PackageOpen } from "lucide-react";

export default defineType({
  name: "product-callout",
  title: "Product Callout",
  type: "object",
  icon: PackageOpen,
  description: "Highlight a product inside article content.",

  // Group visual settings to declutter the editor
  fieldsets: [
    {
      name: "display",
      title: "Display Settings",
      options: { collapsible: true, collapsed: true },
    },
  ],

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
      description: "Leave empty to use the Product's actual title.",
    }),
    defineField({
      name: "blurb",
      type: "text",
      title: "Custom Blurb",
      description: "Leave empty to use the Product's excerpt.",
      rows: 3,
      validation: (rule) =>
        rule.max(240).warning("Keep the blurb concise (≤ 240 characters)"),
    }),
    defineField({
      name: "ctaLabel",
      type: "string",
      title: "CTA Label",
      placeholder: "View product",
      description: "Defaults to 'View product' if left empty.",
    }),

    // Display Settings Fieldset
    defineField({
      name: "align",
      type: "string",
      title: "Alignment",
      fieldset: "display",
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
      title: "Show Product Image",
      fieldset: "display",
      initialValue: true,
    }),
  ],

  // Enhanced Preview Logic
  preview: {
    select: {
      overrideTitle: "title",
      productTitle: "product.title",
      productImage: "product.image",
      showImage: "showImage",
    },
    prepare({ overrideTitle, productTitle, productImage, showImage }) {
      const title = overrideTitle || productTitle || "Select a product";
      const subtitle = showImage
        ? "Product Callout (with image)"
        : "Product Callout (text only)";

      return {
        title: title,
        subtitle: subtitle,
        media: productImage || PackageOpen,
      };
    },
  },
});
