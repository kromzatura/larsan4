import { defineField, defineType } from "sanity";
import { FileClock } from "lucide-react";
import image from "../blocks/shared/image";

export default defineType({
  name: "changelog",
  title: "Changelog",
  type: "document",
  icon: FileClock,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "version",
      title: "Version",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "block-content",
    }),
    image,
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
  ],

  preview: {
    select: {
      title: "title",
      version: "version",
      date: "date",
      media: "image",
    },
    prepare({ title, version, date, media }) {
      return {
        title,
        subtitle: `${version} - ${date}`,
        media,
      };
    },
  },
});
