import { defineType, defineField } from "sanity";
import { ListCollapse } from "lucide-react";

export default defineType({
  name: "faq-9",
  type: "object",
  icon: ListCollapse,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "faqs",
      type: "array",
      title: "FAQs",
      of: [
        {
          name: "faq",
          type: "reference",
          to: [{ type: "faq" }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "faqs.0.title",
    },
    prepare({ title }) {
      return {
        title: "FAQ 9",
        subtitle: title || "No Title",
      };
    },
  },
});
