import { defineType, defineField } from "sanity";
import { CheckCircle } from "lucide-react";

export default defineType({
  name: "compare-products",
  type: "object",
  title: "Compare Products",
  description:
    "Compare table that can auto-populate rows from selected Products and their Specifications, or be entered manually.",
  icon: CheckCircle,
  fields: [
    defineField({ name: "padding", type: "section-padding" }),
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "mode",
      title: "Mode",
      type: "string",
      description:
        "In Product-driven mode, column values come from selected Products (and optional overrides). Freeform allows manual rows/values.",
      options: {
        list: [
          { title: "Freeform (manual rows)", value: "freeform" },
          { title: "Product-driven (from Product)", value: "product" },
        ],
        layout: "radio",
      },
      initialValue: "product",
    }),
    defineField({
      name: "productFields",
      title: "Product fields to show",
      type: "array",
      description:
        "Only used in Product-driven mode. Choose which product/specification fields appear as rows.",
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
    }),
    defineField({
      name: "rows",
      title: "Rows (Freeform)",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Manual row labels. Used only in Freeform mode; ignored in Product-driven mode.",
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
            }),
            defineField({
              name: "overrides",
              title: "Overrides",
              type: "object",
              options: { collapsible: true, collapsed: true },
              fields: [
                defineField({ name: "name", title: "Name", type: "string" }),
                defineField({ name: "sku", title: "SKU", type: "string" }),
                defineField({ name: "bestFor", title: "Best for", type: "string" }),
                defineField({ name: "pungency", title: "Pungency/Heat", type: "string" }),
                defineField({ name: "bindingCapacity", title: "Binding Capacity", type: "string" }),
                defineField({ name: "fatContent", title: "Fat Content (%)", type: "number" }),
              ],
            }),
            // Freeform values for this column (mirrors Compare 6)
            defineField({
              name: "attributes",
              title: "Attributes (Freeform)",
              type: "array",
              of: [
                {
                  name: "item",
                  type: "object",
                  fields: [
                    defineField({ name: "value", type: "string" }),
                    defineField({
                      name: "status",
                      type: "string",
                      options: { list: ["neutral", "positive", "negative"], layout: "radio" },
                      initialValue: "neutral",
                    }),
                  ],
                },
              ],
              description:
                "Manual values per row for this column. Used only in Freeform mode; ignored in Product-driven mode.",
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
