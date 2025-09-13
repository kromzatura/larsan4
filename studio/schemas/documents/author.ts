import { defineField, defineType } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";
import image from "../blocks/shared/image";

export default defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    image,
    orderRankField({ type: "author" }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});
