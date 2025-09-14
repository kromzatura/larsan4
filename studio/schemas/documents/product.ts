import { defineField, defineType } from "sanity";
import { Package, Search, Settings } from "lucide-react";
import image from "../blocks/shared/image";
import meta from "../blocks/shared/meta";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: Package,
  fieldsets: [
    {
      name: "specGrid",
      title: "Specification Details",
      options: { columns: 2 },
    },
  ],
  groups: [
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
    { name: "settings", title: "Settings", icon: Settings },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "settings",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    // Specification fields moved into product
    defineField({
      name: "bestFor",
      title: "Best For",
      type: "string",
      group: "content",
      description: "Short sentence on usage, e.g., 'Baking, sauces, marinades'",
    }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
      group: "content",
      fieldset: "specGrid",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "hsCode", title: "HS Code", type: "string", group: "content", fieldset: "specGrid" }),
    defineField({ name: "minOrder", title: "Minimum Order", type: "string", group: "content", fieldset: "specGrid" }),
    defineField({ name: "origin", title: "Origin", type: "string", group: "content", fieldset: "specGrid" }),
    defineField({ name: "botanicalName", title: "Botanical Name", type: "string", group: "content", fieldset: "specGrid" }),
    defineField({ name: "pungency", title: "Pungency", type: "string", group: "content", fieldset: "specGrid" }),
    defineField({ name: "bindingCapacity", title: "Binding Capacity", type: "string", group: "content", fieldset: "specGrid" }),
    defineField({ name: "fatContent", title: "Fat Content", type: "number", group: "content", fieldset: "specGrid" }),
    defineField({ name: "purity", title: "Purity", type: "string", group: "content", fieldset: "specGrid" }),
    defineField({ name: "moisture", title: "Moisture", type: "string", group: "content", fieldset: "specGrid" }),
    defineField({ name: "shelfLife", title: "Shelf Life", type: "string", group: "content", fieldset: "specGrid" }),
    defineField({ name: "allergenInfo", title: "Allergen Info", type: "string", group: "content", fieldset: "specGrid" }),
    defineField({ name: "productAttributes", title: "Product Attributes", type: "string", group: "content", fieldset: "specGrid" }),
    defineField({ name: "certification", title: "Certification", type: "string", group: "content", fieldset: "specGrid" }),
    defineField({
      name: "keyFeatures",
      title: "Key Features",
      type: "array",
      of: [{ type: "string" }],
      group: "content",
    }),
    defineField({
      name: "packagingOptions",
      title: "Packaging Options",
      type: "array",
      of: [
        defineField({
          name: "packaging",
          type: "object",
          fields: [
            defineField({ name: "sizeValue", title: "Size Value", type: "number" }),
            defineField({ name: "sizeUnit", title: "Size Unit", type: "string" }),
            defineField({ name: "packagingType", title: "Packaging Type", type: "string" }),
            defineField({ name: "weightPerPallet", title: "Weight per pallet", type: "string" }),
            defineField({ name: "notes", title: "Notes", type: "string" }),
          ],
        }),
      ],
      group: "content",
    }),
    image,
    defineField({ name: "body", title: "Body", type: "block-content", group: "content" }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      group: "content",
      rows: 3,
      description: "Short description shown in listings and SEO fallback.",
      validation: (Rule) => Rule.max(160).warning("Keep under 160 characters."),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "productCategory" } }],
      group: "settings",
    }),
    meta,
  ],
  preview: {
    select: { title: "title", media: "image" },
    prepare: ({ title, media }) => ({ title: title || "Untitled Product", media }),
  },
});
