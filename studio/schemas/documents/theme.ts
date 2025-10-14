import { defineField, defineType } from "sanity";
import { Palette } from "lucide-react";

export default defineType({
  name: "theme",
  title: "Theme",
  type: "document",
  icon: Palette,
  groups: [
    { name: "palette", title: "Palette", icon: Palette, default: true },
    { name: "surfaces", title: "Surfaces", icon: Palette },
    { name: "shape", title: "Shape & Shadow", icon: Palette },
    { name: "typography", title: "Typography", icon: Palette },
    { name: "charts", title: "Charts", icon: Palette },
  ],
  fields: [
    defineField({
      name: "name",
      type: "string",
      description: "Display name of this theme",
      validation: (rule) => rule.required().error("Theme name is required"),
      group: "palette",
    }),
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
      description: "Internal: locale of this theme instance",
    }),
    // Palette
    defineField({ name: "background", type: "string", group: "palette", description: "CSS color (oklch(), hsl(), hex)" }),
    defineField({ name: "foreground", type: "string", group: "palette" }),
    defineField({ name: "primary", type: "string", group: "palette" }),
    defineField({ name: "primaryForeground", type: "string", group: "palette" }),
    defineField({ name: "secondary", type: "string", group: "palette" }),
    defineField({ name: "secondaryForeground", type: "string", group: "palette" }),
    defineField({ name: "accent", type: "string", group: "palette" }),
    defineField({ name: "accentForeground", type: "string", group: "palette" }),
    defineField({ name: "muted", type: "string", group: "palette" }),
    defineField({ name: "mutedForeground", type: "string", group: "palette" }),
    defineField({ name: "destructive", type: "string", group: "palette" }),
    defineField({ name: "destructiveForeground", type: "string", group: "palette" }),
    defineField({ name: "border", type: "string", group: "palette" }),
    defineField({ name: "input", type: "string", group: "palette" }),
    defineField({ name: "ring", type: "string", group: "palette" }),
    defineField({ name: "ringFocus", type: "string", group: "palette" }),

    // Surfaces
    defineField({ name: "card", type: "string", group: "surfaces" }),
    defineField({ name: "cardForeground", type: "string", group: "surfaces" }),
    defineField({ name: "popover", type: "string", group: "surfaces" }),
    defineField({ name: "popoverForeground", type: "string", group: "surfaces" }),
    defineField({ name: "sidebar", type: "string", group: "surfaces" }),
    defineField({ name: "sidebarForeground", type: "string", group: "surfaces" }),
    defineField({ name: "sidebarPrimary", type: "string", group: "surfaces" }),
    defineField({ name: "sidebarPrimaryForeground", type: "string", group: "surfaces" }),
    defineField({ name: "sidebarAccent", type: "string", group: "surfaces" }),
    defineField({ name: "sidebarAccentForeground", type: "string", group: "surfaces" }),
    defineField({ name: "sidebarBorder", type: "string", group: "surfaces" }),
    defineField({ name: "sidebarRing", type: "string", group: "surfaces" }),

    // Charts (optional)
    defineField({ name: "chart1", type: "string", group: "charts" }),
    defineField({ name: "chart2", type: "string", group: "charts" }),
    defineField({ name: "chart3", type: "string", group: "charts" }),
    defineField({ name: "chart4", type: "string", group: "charts" }),
    defineField({ name: "chart5", type: "string", group: "charts" }),

    // Shape & Shadow
    defineField({
      name: "radius",
      type: "number",
      group: "shape",
      description: "Base radius in rem (0.0–1.5). Applied to --radius and derived sizes.",
      validation: (rule) => rule.min(0).max(1.5).warning("Prefer 0.25–0.6 for balanced UI"),
    }),
    defineField({
      name: "shadowScale",
      type: "string",
      group: "shape",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "Subtle", value: "subtle" },
          { title: "Default", value: "default" },
          { title: "Strong", value: "strong" },
        ],
        layout: "radio",
      },
      initialValue: "default",
    }),

    // Typography
    defineField({ name: "fontSans", type: "string", group: "typography", description: "CSS font-family value for --font-sans" }),
    defineField({ name: "fontSerif", type: "string", group: "typography" }),
    defineField({ name: "fontMono", type: "string", group: "typography" }),
  ],
  preview: {
    select: { title: "name" },
    prepare({ title }) {
      return { title: title || "Theme" };
    },
  },
});
