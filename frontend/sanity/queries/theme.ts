import { groq } from "next-sanity";

// Returns a language-specific Theme when available; otherwise falls back to the first Theme document.
// This enables a single site-wide Theme setup without requiring per-locale duplicates.
export const THEME_QUERY = groq`
  coalesce(
    *[_type == "theme" && language == $lang][0],
    *[_type == "theme" && _id == "theme.default"][0],
    *[_type == "theme" && slug.current == "default"][0],
    *[_type == "theme"][0]
  ){
  _id,
  name,
  slug,
  language,
  // palette
  background,
  foreground,
  card,
  cardForeground,
  popover,
  popoverForeground,
  primary,
  primaryForeground,
  secondary,
  secondaryForeground,
  muted,
  mutedForeground,
  accent,
  accentForeground,
  destructive,
  destructiveForeground,
  border,
  input,
  ring,
  ringFocus,
  // surfaces
  sidebar,
  sidebarForeground,
  sidebarPrimary,
  sidebarPrimaryForeground,
  sidebarAccent,
  sidebarAccentForeground,
  sidebarBorder,
  sidebarRing,
  // charts
  chart1,
  chart2,
  chart3,
  chart4,
  chart5,
  // shape & shadow
  radius,
  shadowScale,
  // typography
  fontSans,
  fontSerif,
  fontMono,
  // overlays
  overlayDark30,
  overlayDark50,
  overlayBrandGradientFrom,
}`;
