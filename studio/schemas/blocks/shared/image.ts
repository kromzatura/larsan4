import { defineField } from "sanity";

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
    },
  ],
});
