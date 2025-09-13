import { defineType, defineField } from "sanity";
import { ListCollapse } from "lucide-react";

export default defineType({
  name: "faq-8",
  type: "object",
  icon: ListCollapse,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
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
        title: "FAQ 8",
        subtitle: title || "No Title",
      };
    },
  },
});
