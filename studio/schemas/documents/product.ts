import { defineField, defineType } from "sanity";
import { Package, Search, Settings } from "lucide-react";
import image from "../blocks/shared/image";
import meta from "../blocks/shared/meta";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: Package,
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
    defineField({
      name: "specifications",
      title: "Specifications",
      type: "reference",
      to: [{ type: "specification" }],
      group: "content",
      description: "Select the specification sheet for this product",
    }),
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
            defineField({ name: "caseWeight", title: "Case Weight", type: "string" }),
            defineField({ name: "notes", title: "Notes", type: "string" }),
          ],
        }),
      ],
      group: "content",
    }),
    image,
    defineField({ name: "body", title: "Body", type: "block-content", group: "content" }),
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
