import { defineField, defineType } from "sanity";

export default defineType({
  name: "specification",
  title: "Specification",
  type: "document",
  groups: [
    { name: "content", title: "Content" },
    { name: "settings", title: "Settings" },
  ],
  fieldsets: [
    {
      name: "specGrid",
      title: "Specification Details",
      options: { columns: 2 },
    },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
      description: "Internal reference name, e.g., 'Mustard Seed Spec Sheet'",
    }),
    defineField({
      name: "bestFor",
      title: "Best For",
      type: "string",
      group: "content",
      description: "Short sentence on usage, e.g., 'Baking, sauces, marinades'",
    }),
    // Two-column grid starts here
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
  ],
  preview: {
    select: { title: "name", sku: "sku" },
    prepare: ({ title, sku }) => ({
      title: title || "Untitled Specification",
      subtitle: sku ? `SKU: ${sku}` : undefined,
    }),
  },
});
