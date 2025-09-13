import { defineType, defineField } from "sanity";
import { ListCollapse } from "lucide-react";

export default defineType({
  name: "faq-14",
  type: "object",
  icon: ListCollapse,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "title",
      type: "object",
      fields: [
        defineField({
          name: "text",
          type: "string",
        }),
        defineField({
          name: "element",
          type: "string",
          options: {
            list: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "div"],
          },
          initialValue: "h2",
        }),
        defineField({
          name: "size",
          type: "string",
          options: {
            list: ["small", "default", "large"],
          },
          initialValue: "default",
        }),
        defineField({
          name: "weight",
          type: "string",
          options: {
            list: ["normal", "medium", "semibold", "bold"],
          },
          initialValue: "bold",
        }),
      ],
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "sections",
      type: "array",
      title: "FAQ Section",
      of: [
        {
          name: "faqSection",
          type: "object",
          title: "FAQ Section",
          fields: [
            {
              name: "title",
              type: "string",
              title: "Title",
            },
            {
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
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "sections.0.title",
    },
    prepare({ title }) {
      return {
        title: "FAQ 14",
        subtitle: title || "No Title",
      };
    },
  },
});
