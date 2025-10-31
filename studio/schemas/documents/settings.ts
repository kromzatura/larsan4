import { defineField, defineType } from "sanity";
import { Settings } from "lucide-react";

export default defineType({
  name: "settings",
  title: "Settings",
  type: "document",
  icon: Settings,
  fields: [
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
      validation: (Rule) => Rule.required().error("Site name is required"),
    }),
    defineField({
      name: "description",
      type: "string",
      description: "The description of your site. Used in the footer.",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Profiles",
      type: "array",
      description:
        "Links to your official social profiles (used for Organization sameAs).",
      of: [
        defineField({
          name: "url",
          type: "url",
          title: "Profile URL",
          validation: (Rule) =>
            Rule.uri({ scheme: ["http", "https"] }).warning(
              "Use full https:// URLs"
            ),
        }),
      ],
      validation: (Rule) => Rule.max(10).warning("Keep to top 10 profiles"),
    }),
    defineField({
      name: "copyright",
      type: "block-content",
      description: "The copyright text to display in the footer",
    }),
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
