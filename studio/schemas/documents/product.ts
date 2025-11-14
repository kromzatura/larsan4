import { defineField, defineType } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";
import { Package, Search, Settings } from "lucide-react";
import image from "../blocks/shared/image";
import meta from "../blocks/shared/meta";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: Package,
  groups: [
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
    { name: "settings", title: "Settings", icon: Settings },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "blocks",
      title: "Blocks",
      type: "array",
      group: "content",
      description:
        "Optional blocks that render above the product content. Use a Section Header to control the H1 and description.",
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
            { name: "section-header", of: ["section-header"] },
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
            { name: "faq", of: ["faq-1", "faq-5", "faq-8", "faq-9", "faq-14"] },
            { name: "banner", of: ["banner-block"] },
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
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "settings",
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
            _type == "product" &&
            slug.current == $slug &&
            language == $language &&
            !(_id in [$id, $baseId, "drafts." + $baseId])
          ])`;
          const params = { slug, language, id, baseId };
          const result = await client.fetch(query, params);
          return result === 0;
        },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "specifications",
      title: "Specifications",
      type: "array",
      of: [{ type: "reference", to: [{ type: "specification" }] }],
      group: "content",
      description: "Link one or more specification sheets for this product",
      validation: (rule) => rule.max(3).warning("Keep specs concise (max 3)"),
    }),
    defineField({
      name: "keyFeatures",
      title: "Key Features",
      type: "array",
      of: [{ type: "string" }],
      group: "content",
    }),
    defineField({
      name: "packagingOptions",
      title: "Packaging Options",
      type: "array",
      of: [
        defineField({
          name: "packaging",
          type: "object",
          fields: [
            defineField({
              name: "sizeValue",
              title: "Size Value",
              type: "number",
              validation: (Rule) => Rule.min(0),
            }),
            defineField({
              name: "sizeUnit",
              title: "Size Unit",
              type: "string",
              options: {
                list: [
                  { title: "kg", value: "kg" },
                  { title: "ton", value: "ton" },
                ],
              },
              initialValue: "kg",
            }),
            defineField({
              name: "packagingType",
              title: "Packaging Type",
              type: "string",
              options: {
                list: [
                  { title: "Paper bag", value: "Paper bag" },
                  { title: "Papieren zak", value: "Papieren zak" },
                  { title: "Big Bag", value: "Big Bag" },
                ],
              },
            }),
            defineField({
              name: "weightPerPallet",
              title: "Weight per pallet",
              type: "string",
            }),
            defineField({ name: "notes", title: "Notes", type: "string" }),
          ],
          preview: {
            select: {
              packagingType: "packagingType",
              sizeValue: "sizeValue",
              sizeUnit: "sizeUnit",
            },
            prepare: ({ packagingType, sizeValue, sizeUnit }) => {
              const size = [sizeValue, sizeUnit].filter(Boolean).join(" ");
              return {
                title: packagingType || "Package",
                subtitle: size || undefined,
              };
            },
          },
        }),
      ],
      group: "content",
    }),
    image,
    defineField({
      name: "body",
      title: "Body",
      type: "block-content",
      group: "content",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      group: "content",
      rows: 3,
      description: "Short description shown in listings and SEO fallback.",
      validation: (Rule) => Rule.max(260).warning("Keep under 160 characters."),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "productCategory" } }],
      group: "settings",
    }),
    defineField({
      // should match 'languageField' plugin configuration setting, if customized
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    meta,
    // Manual ordering support
    orderRankField({ type: "product" }),
  ],
  preview: {
    select: { title: "title", media: "image" },
    prepare: ({ title, media }) => ({
      title: title || "Untitled Product",
      media,
    }),
  },
});
