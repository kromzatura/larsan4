import { defineField, defineType } from "sanity";
import { PhoneCall } from "lucide-react";
import meta from "../blocks/shared/meta";

export default defineType({
  name: "contact",
  title: "Contact Page",
  type: "document",
  icon: PhoneCall,
  groups: [
    {
      name: "content",
      title: "Content",
    },
    {
      name: "seo",
      title: "SEO",
    },
  ],
  fields: [
    defineField({
      name: "tagline",
      type: "string",
      group: "content",
      description: "The tagline shown above the title (e.g. 'Reach Us')",
      validation: (Rule) => Rule.required().error("Tagline is required"),
    }),
    defineField({
      name: "title",
      type: "string",
      group: "content",
      description: "The main title of the contact page",
      validation: (Rule) => Rule.required().error("Title is required"),
    }),
    defineField({
      name: "description",
      type: "text",
      group: "content",
      description: "The description text below the title",
      validation: (Rule) => Rule.required().error("Description is required"),
    }),
    defineField({
      name: "contactMethods",
      type: "array",
      group: "content",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "icon",
              type: "string",
              options: {
                list: [
                  { title: "Mail", value: "mail" },
                  { title: "Messages", value: "messages" },
                  { title: "Map Pin", value: "mapPin" },
                  { title: "Phone", value: "phone" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              type: "text",
            }),
            // Authoring toggle to avoid accidental link validation when adding address-only items
            defineField({
              name: "hasLink",
              type: "boolean",
              title: "Has link?",
              initialValue: false,
              description:
                "Enable to add a button/link. Leave off for address-only items.",
            }),
            defineField({
              name: "link",
              type: "link",
              hidden: ({ parent }) => !parent?.hasLink,
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const hasLink = (context?.parent as any)?.hasLink;
                  if (!hasLink) return true; // not required when toggle is off
                  return value
                    ? true
                    : "Link is required when 'Has link?' is enabled";
                }),
            }),
          ],
        },
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(4)
          .error("At least 1 contact method is required, and no more than 4"),
    }),
    defineField({
      // should match 'languageField' plugin configuration setting, if customized
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    meta,
  ],
  preview: {
    select: {
      title: "title",
      tagline: "tagline",
    },
    prepare({ title, tagline }) {
      return {
        title: "Contact Page Settings",
        subtitle: tagline,
      };
    },
  },
});
