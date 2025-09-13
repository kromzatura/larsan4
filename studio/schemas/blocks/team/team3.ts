import { defineField, defineType } from "sanity";
import { Users } from "lucide-react";

export default defineType({
  name: "team-3",
  type: "object",
  title: "Team 3",
  description: "A list of all team members",
  icon: Users,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Team 3",
      };
    },
  },
});
