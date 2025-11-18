import { defineArrayMember, defineType } from "sanity";

// Minimal inline-rich-text for short descriptions/headings
// - Single block type with basic decorators and optional link annotation
// - No images, lists, or custom objects
export default defineType({
  name: "inline-rich-text",
  title: "Inline Rich Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      // Allow lightweight headings for subhead/strapline use-cases
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H1", value: "h1" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
      ],
      lists: [],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [{ name: "link", type: "link" }],
      },
    }),
  ],
});
