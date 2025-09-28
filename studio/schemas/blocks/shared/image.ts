import { defineField } from "sanity";
// Rolled back: keep single alt field per localized document.

export default defineField({
  name: "image",
  title: "Image",
  type: "image",
  options: {
    hotspot: true,
  },
  fields: [
    {
      name: "alt",
      type: "string",
      title: "Alternative Text",
      description: "Describe the image for screen readers (language handled per translated document).",
      validation: (rule) => rule.max(140).warning('Keep alt concise (< 140 chars).'),
    },
  ],
});
