import { defineField, defineType } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";
import { FileText, Settings } from "lucide-react";

export default defineType({
  name: "specification",
  title: "Specification",
  type: "document",
  icon: FileText,
  groups: [
    { name: "content", title: "Content", icon: FileText },
    { name: "settings", title: "Settings", icon: Settings },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "content",
      description: "Internal reference name, e.g., 'Mustard Seed Spec Sheet'",
      validation: (Rule) => Rule.required().error("Name is required"),
    }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().error("SKU is required"),
    }),
    defineField({ name: "bestFor", title: "Best For", type: "string", group: "content" }),
    defineField({ name: "pungency", title: "Pungency", type: "string", group: "content" }),
    defineField({ name: "bindingCapacity", title: "Binding Capacity", type: "string", group: "content" }),
    defineField({ name: "fatContent", title: "Fat Content", type: "number", group: "content" }),
    defineField({ name: "purity", title: "Purity", type: "string", group: "content" }),
    defineField({ name: "moisture", title: "Moisture", type: "string", group: "content" }),
    defineField({ name: "hsCode", title: "HS Code", type: "string", group: "content" }),
    defineField({ name: "minOrder", title: "Minimum Order", type: "string", group: "content" }),
    defineField({ name: "origin", title: "Origin", type: "string", group: "content" }),
    defineField({ name: "botanicalName", title: "Botanical Name", type: "string", group: "content" }),
    defineField({ name: "shelfLife", title: "Shelf Life", type: "string", group: "content" }),
    defineField({ name: "allergenInfo", title: "Allergen Info", type: "string", group: "content" }),
    defineField({ name: "productAttributes", title: "Product Attributes", type: "string", group: "content" }),
    defineField({ name: "certification", title: "Certification", type: "string", group: "content" }),
    orderRankField({ type: "specification" }),
  ],
  preview: {
    select: { title: "name", sku: "sku" },
    prepare: ({ title, sku }) => ({
      title: title || "Untitled Specification",
      subtitle: sku ? `SKU: ${sku}` : undefined,
    }),
  },
});
