import { defineType, defineField } from "sanity";
import { CheckCircle } from "lucide-react";

export default defineType({
  name: "compare-products",
  type: "object",
  title: "Compare Products",
  description:
    "Compare table that auto-populates rows from selected Products and their Specifications.",
  icon: CheckCircle,
  fields: [
    defineField({ name: "padding", type: "section-padding" }),
    defineField({ name: "title", type: "string" }),
    // Product-driven only
    defineField({
      name: "productFields",
      title: "Product fields to show",
      type: "array",
      description: "Choose which product/specification fields appear as rows.",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Pungency/Heat", value: "pungency" },
          { title: "Fat Content (%)", value: "fatContent" },
          { title: "Binding Capacity", value: "bindingCapacity" },
          { title: "Best for", value: "bestFor" },
          { title: "SKU", value: "sku" },
          { title: "Actions row (Inquiry button)", value: "actions" },
        ],
      },
      initialValue: [
        "pungency",
        "fatContent",
        "bindingCapacity",
        "bestFor",
        "sku",
        "actions",
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "columns",
      type: "array",
      of: [
        {
          name: "column",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              description:
                "Column header. In Product-driven mode this falls back to Product title when empty or you can override via Overrides → Name.",
            }),
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              description:
                "Pick a product to populate rows in Product-driven mode.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "overrides",
              title: "Overrides",
              type: "object",
              options: { collapsible: true, collapsed: true },
              fields: [
                defineField({ name: "name", title: "Name", type: "string" }),
                defineField({ name: "sku", title: "SKU", type: "string" }),
                defineField({
                  name: "bestFor",
                  title: "Best for",
                  type: "string",
                }),
                defineField({
                  name: "pungency",
                  title: "Pungency/Heat",
                  type: "string",
                }),
                defineField({
                  name: "bindingCapacity",
                  title: "Binding Capacity",
                  type: "string",
                }),
                defineField({
                  name: "fatContent",
                  title: "Fat Content (%)",
                  type: "number",
                }),
              ],
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(2).max(4),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: "Compare Products", subtitle: title || "No Title" };
    },
  },
});
