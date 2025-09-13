import { defineField, defineType } from "sanity";
import { Users } from "lucide-react";

export default defineType({
  name: "team-5",
  type: "object",
  title: "Team 5",
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
        title: "Team 5",
      };
    },
  },
});
