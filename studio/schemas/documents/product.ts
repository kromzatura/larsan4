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
      description: "Company SKU (required)",
      validation: (Rule) => Rule.required(),
    }),
  defineField({ name: "hsCode", title: "HS Code", type: "string", group: "content", fieldset: "specGrid", description: 'e.g., "120799"' }),
  defineField({ name: "minOrder", title: "Minimum Order", type: "string", group: "content", fieldset: "specGrid", description: 'e.g., "24 tons"' }),
  defineField({ name: "origin", title: "Origin", type: "string", group: "content", fieldset: "specGrid", description: 'e.g., "India"' }),
    defineField({ name: "botanicalName", title: "Botanical Name", type: "string", group: "content", fieldset: "specGrid" }),
    defineField({ name: "pungency", title: "Pungency", type: "string", group: "content", fieldset: "specGrid" }),
    defineField({ name: "bindingCapacity", title: "Binding Capacity", type: "string", group: "content", fieldset: "specGrid" }),
    defineField({ name: "fatContent", title: "Fat Content", type: "number", group: "content", fieldset: "specGrid" }),
    defineField({ name: "purity", title: "Purity", type: "string", group: "content", fieldset: "specGrid" }),
  defineField({ name: "moisture", title: "Moisture", type: "string", group: "content", fieldset: "specGrid", description: 'e.g., "<10%"' }),
  defineField({ name: "shelfLife", title: "Shelf Life", type: "string", group: "content", fieldset: "specGrid", description: 'e.g., "12 months"' }),
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
            defineField({ name: "sizeValue", title: "Size Value", type: "number", validation: (Rule) => Rule.min(0) }),
            defineField({
              name: "sizeUnit",
              title: "Size Unit",
              type: "string",
              options: {
                list: [
                  { title: "kg", value: "kg" },
                  { title: "ton", value: "ton" },
                ],
              },
              initialValue: "kg",
            }),
            defineField({
              name: "packagingType",
              title: "Packaging Type",
              type: "string",
              options: {
                list: [
                  { title: "Paper bag", value: "Paper bag" },
                  { title: "Big Bag", value: "Big Bag" },
                ],
              },
            }),
            defineField({ name: "weightPerPallet", title: "Weight per pallet", type: "string" }),
            defineField({ name: "notes", title: "Notes", type: "string" }),
          ],
          preview: {
            select: {
              packagingType: "packagingType",
              sizeValue: "sizeValue",
              sizeUnit: "sizeUnit",
            },
            prepare: ({ packagingType, sizeValue, sizeUnit }) => {
              const size = [sizeValue, sizeUnit].filter(Boolean).join(" ");
              return {
                title: packagingType || "Package",
                subtitle: size || undefined,
              };
            },
          },
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
