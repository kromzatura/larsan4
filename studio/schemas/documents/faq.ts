import { defineField, defineType } from "sanity";
import { ListCollapse } from "lucide-react";
import { orderRankField } from "@sanity/orderable-document-list";

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  icon: ListCollapse,
  fields: [
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
      description: "Explicit locale tag for querying.",
      initialValue: () => "en",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      type: "block-content",
    }),
    orderRankField({ type: "faq" }),
  ],

  preview: {
    select: {
      title: "title",
    },
  },
});
