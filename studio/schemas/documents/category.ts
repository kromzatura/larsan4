import { defineField, defineType } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";
import { BookA, Search } from "lucide-react";
import { COLOR_VARIANTS } from "../blocks/shared/color-variants";

const category = defineType({
  name: "category",
  title: "Category",
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
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "content",
      validation: (Rule) =>
        Rule.max(200).warning("Prefer concise descriptions (≤ 200 chars)"),
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      group: "content",
      options: {
        list: COLOR_VARIANTS.map(({ title, value }) => ({ title, value })),
      },
      description:
        "The color of the category. Used for changelog 3 categories.",
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "object",
      group: "seo",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "title",
          title: "SEO Title",
          type: "string",
          validation: (Rule) => Rule.max(60).warning(),
        }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          validation: (Rule) => Rule.max(160).warning(),
        }),
      ],
    }),
    orderRankField({ type: "category" }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      color: "color",
    },
    prepare({ title, slug, color }) {
      return {
        title: title || "Untitled Category",
        subtitle: [slug ? `/${slug}` : null, color].filter(Boolean).join(" · "),
      };
    },
  },
});

export default category;
