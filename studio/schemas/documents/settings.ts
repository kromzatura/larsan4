import { defineField, defineType } from "sanity";
import { Settings } from "lucide-react";

export default defineType({
  name: "settings",
  title: "Settings",
  type: "document",
  icon: Settings,
  fields: [
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
      options: { aiAssist: { exclude: true } },
    }),
    defineField({
      name: "logo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
        }),
        defineField({
          name: "width",
          type: "number",
          title: "Width",
          description:
            "The width of the logo. Default is dimensions of the image.",
        }),
        defineField({
          name: "height",
          type: "number",
          title: "Height",
          description:
            "The height of the logo. Default is dimensions of the image.",
        }),
      ],
    }),
    defineField({
      name: "siteName",
      type: "string",
      description: "The name of your site",
      validation: (Rule) =>
        Rule.required()
          .error("Site name is required")
          .custom(async (value, context) => {
            const { document, getClient } = context as any;
            const lang = (document as any)?.language;
            if (!lang) return true;
            const client = getClient({
              apiVersion: process.env.SANITY_STUDIO_API_VERSION!,
            });
            const id: string | undefined = document?._id;
            const baseId = id?.replace(/^drafts\./, "");
            const query = `count(*[_type == "settings" && language == $lang && !(_id in [$id, $baseId, "drafts." + $baseId])])`;
            const count = await client.fetch(query, { lang, id, baseId });
            return count === 0
              ? true
              : "Only one Settings document is allowed per language";
          }),
    }),
    defineField({
      name: "description",
      type: "string",
      description: "The description of your site. Used in the footer.",
    }),
    defineField({
      name: "copyright",
      type: "block-content",
      description: "The copyright text to display in the footer",
    }),
  ],
  preview: {
    select: {
      title: "siteName",
      media: "logo",
    },
    prepare({ title, media }) {
      return {
        title: title || "Site Settings",
        media,
      };
    },
  },
});
