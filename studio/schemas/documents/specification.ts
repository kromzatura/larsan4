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
      name: "seedSize",
      title: "Seed Size",
      type: "string",
      group: "content",
      description: "Example: Uniform, 2-3mm diameter",
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      group: "content",
      description: "Example: Yellow, natural (hulled)",
    }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().error("SKU is required"),
    }),
    defineField({
      name: "bestFor",
      title: "Best For",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "pungency",
      title: "Pungency",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "bindingCapacity",
      title: "Binding Capacity",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "fatContent",
      title: "Fat Content",
      type: "number",
      group: "content",
    }),
    defineField({
      name: "purity",
      title: "Purity",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "moisture",
      title: "Moisture",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "hsCode",
      title: "HS Code",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "minOrder",
      title: "Minimum Order",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "origin",
      title: "Origin",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "botanicalName",
      title: "Botanical Name",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "shelfLife",
      title: "Shelf Life",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "allergenInfo",
      title: "Allergen Info",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "nutritionalValuesPer100g",
      title: "Nutritional Values (per 100 g)",
      type: "object",
      group: "content",
      fields: [
        defineField({
          name: "energy",
          title: "Energy (kcal)",
          type: "number",
          description: "Energy per 100 g in kcal",
        }),
        defineField({
          name: "protein",
          title: "Protein (g)",
          type: "number",
        }),
        defineField({
          name: "carbohydrates",
          title: "Carbohydrates (g)",
          type: "number",
        }),
        defineField({
          name: "fat",
          title: "Fat (g)",
          type: "number",
        }),
        defineField({
          name: "fiber",
          title: "Fiber (g)",
          type: "number",
        }),
        defineField({
          name: "magnesium",
          title: "Magnesium (mg)",
          type: "number",
        }),
        defineField({
          name: "phosphorus",
          title: "Phosphorus (mg)",
          type: "number",
        }),
      ],
    }),
    defineField({
      name: "productAttributes",
      title: "Product Attributes",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "certificationsCompliance",
      title: "Certifications & Compliance",
      type: "object",
      group: "content",
      fields: [
        defineField({
          name: "ifsBrokerCertified",
          title: "IFS Broker Certified",
          type: "string",
          options: {
            list: [
              { title: "Yes", value: "yes" },
              { title: "No", value: "no" },
            ],
            layout: "radio",
          },
        }),
        defineField({
          name: "glutenFreeCertified",
          title: "Gluten-Free Certified (<20ppm)",
          type: "string",
          options: {
            list: [
              { title: "Yes", value: "yes" },
              { title: "No", value: "no" },
            ],
            layout: "radio",
          },
        }),
        defineField({
          name: "gmoFree",
          title: "GMO-Free (Non-GMO)",
          type: "string",
          options: {
            list: [
              { title: "Yes", value: "yes" },
              { title: "No", value: "no" },
            ],
            layout: "radio",
          },
        }),
        defineField({
          name: "pesticideFreeTested",
          title: "Pesticide-Free Tested",
          type: "string",
          options: {
            list: [
              { title: "Yes", value: "yes" },
              { title: "No", value: "no" },
            ],
            layout: "radio",
          },
        }),
        defineField({
          name: "euFoodSafetyStandards",
          title: "EU Food Safety Standards",
          type: "string",
          options: {
            list: [
              { title: "Yes", value: "yes" },
              { title: "No", value: "no" },
            ],
            layout: "radio",
          },
        }),
        defineField({
          name: "haccpCompliant",
          title: "HACCP Compliant",
          type: "string",
          options: {
            list: [
              { title: "Yes", value: "yes" },
              { title: "No", value: "no" },
            ],
            layout: "radio",
          },
        }),
        defineField({
          name: "halalSuitable",
          title: "Halal Suitable",
          type: "string",
          options: {
            list: [
              { title: "Yes", value: "yes" },
              { title: "No", value: "no" },
            ],
            layout: "radio",
          },
        }),
        defineField({
          name: "veganSuitable",
          title: "Vegan Suitable",
          type: "string",
          options: {
            list: [
              { title: "Yes", value: "yes" },
              { title: "No", value: "no" },
            ],
            layout: "radio",
          },
        }),
        defineField({
          name: "kosherSuitable",
          title: "Kosher Suitable",
          type: "string",
          options: {
            list: [
              { title: "Yes", value: "yes" },
              { title: "No", value: "no" },
            ],
            layout: "radio",
          },
        }),
      ],
    }),
    orderRankField({ type: "specification" }),
    defineField({
      // should match 'languageField' plugin configuration setting, if customized
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: { title: "name", sku: "sku" },
    prepare: ({ title, sku }) => ({
      title: title || "Untitled Specification",
      subtitle: sku ? `SKU: ${sku}` : undefined,
    }),
  },
});
