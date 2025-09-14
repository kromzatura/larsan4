import { defineField, defineType } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";
import { BookA, Search } from "lucide-react";
import meta from "../blocks/shared/meta";

export default defineType({
  name: "productCategory",
  title: "Product Category",
  type: "document",
  icon: BookA,
  groups: [
    { name: "content", title: "Content", icon: BookA },
    { name: "seo", title: "SEO", icon: Search },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().error("Title is required"),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required().error("Slug is required"),
    }),
    meta,
    orderRankField({ type: "productCategory" }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare({ title, slug }) {
      return { title: title || "Untitled Product Category", subtitle: slug ? `/${slug}` : undefined };
    },
  },
});
