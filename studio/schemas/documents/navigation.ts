import { defineField, defineType } from "sanity";
import { Menu } from "lucide-react";
import { orderRankField } from "@sanity/orderable-document-list";

export default defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  icon: Menu,
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "Used to identify the navigation item in CMS",
      validation: (Rule) =>
        Rule.required().custom(async (value, context) => {
          const { document, getClient } = context;
          const client = getClient({
            apiVersion: process.env.SANITY_STUDIO_API_VERSION!,
          });
          const id = document?._id;
          const language = (document as any)?.language;

          // Extract the base ID without the draft prefix
          const baseId = id?.replace(/^drafts\./, "");

          // Query that excludes both the current document and its draft version
          const query = `count(*[
            _type == "navigation" &&
            title == $title &&
            language == $language &&
            !(_id in [$id, $baseId, "drafts." + $baseId])
          ])`;
          const result = await client.fetch(query, {
            title: value,
            id,
            baseId,
            language,
          });

          return result === 0 ? true : "Navigation title must be unique";
        }),
    }),
    defineField({
      name: "links",
      type: "array",
      of: [{ type: "link" }, { type: "link-group" }],
    }),
    orderRankField({ type: "navigation" }),
    defineField({
      // should match 'languageField' plugin configuration setting, if customized
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
  ],

  preview: {
    select: {
      title: "title",
    },
  },
});
