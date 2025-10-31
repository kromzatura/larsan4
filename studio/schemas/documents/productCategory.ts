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
      name: "blocks",
      title: "Blocks",
      type: "array",
      group: "content",
      description:
        "Use a Section Header to control the H1 and description for the category page. You can add additional blocks as needed.",
      of: [
        { type: "section-header" },
        // Feature blocks
        { type: "feature-1" },
        { type: "feature-3" },
        { type: "feature-12" },
        { type: "feature-15" },
        { type: "feature-66" },
        { type: "feature-117" },
        { type: "feature-157" },
        { type: "feature-202" },
        // FAQ blocks
        { type: "faq-1" },
        { type: "faq-5" },
        { type: "faq-8" },
        { type: "faq-9" },
        { type: "faq-14" },
        // Banner
        { type: "banner-block" },
      ],
      options: {
        insertMenu: {
          groups: [
            {
              name: "section-header",
              of: ["section-header"],
            },
            {
              name: "feature",
              of: [
                "feature-1",
                "feature-3",
                "feature-12",
                "feature-15",
                "feature-66",
                "feature-117",
                "feature-157",
                "feature-202",
              ],
            },
            {
              name: "faq",
              of: ["faq-1", "faq-5", "faq-8", "faq-9", "faq-14"],
            },
            {
              name: "banner",
              of: ["banner-block"],
            },
          ],
          views: [
            {
              name: "grid",
              previewImageUrl: (block) => `/static/images/preview/${block}.jpg`,
            },
            { name: "list" },
          ],
        },
      },
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      group: "content",
      description: "Optional description shown on the category page",
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: async (slug, context) => {
          const { document, getClient } = context as any;
          const client = getClient({
            apiVersion: process.env.SANITY_STUDIO_API_VERSION!,
          });
          const id = document?._id;
          const baseId = id?.replace(/^drafts\./, "");
          const language = (document as any)?.language;

          const query = `count(*[
            _type == "productCategory" &&
            slug.current == $slug &&
            language == $language &&
            !(_id in [$id, $baseId, "drafts." + $baseId])
          ])`;
          const params = { slug, language, id, baseId };
          const result = await client.fetch(query, params);
          return result === 0;
        },
      },
      validation: (Rule) => Rule.required().error("Slug is required"),
    }),
    defineField({
      // should match 'languageField' plugin configuration setting, if customized
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    meta,
    orderRankField({ type: "productCategory" }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare({ title, slug }) {
      return {
        title: title || "Untitled Product Category",
        subtitle: slug ? `/${slug}` : undefined,
      };
    },
  },
});
