import { defineType, defineField } from "sanity";
import { Languages } from "lucide-react";

// Minimal throwaway doc type to validate translation plugin + Assist bulk translate action
export default defineType({
  name: "translationTest",
  title: "Translation Test",
  type: "document",
  icon: Languages,
  fields: [
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
      description: "Explicit locale tag for translation test documents.",
      initialValue: () => "en",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
      description: "Short title to translate",
      options: { aiAssist: { translateAction: true } },
    }),
    defineField({
      name: "body",
      type: "text",
      rows: 5,
      description: "Paragraph used to test bulk and field-level translation",
      options: { aiAssist: { translateAction: true } },
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title: title || "Untitled Test" }),
  },
});
