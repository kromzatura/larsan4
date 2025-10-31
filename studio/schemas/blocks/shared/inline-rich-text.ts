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
      styles: [{ title: "Normal", value: "normal" }],
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
