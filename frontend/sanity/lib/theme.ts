import { type QueryParams } from "next-sanity";
import { client } from "../lib/client";
import { THEME_QUERY } from "../queries/theme";

export type ThemeDoc = {
  name?: string;
  slug?: { current?: string };
  language?: string;
  background?: string;
  foreground?: string;
  card?: string;
  cardForeground?: string;
  popover?: string;
  popoverForeground?: string;
  primary?: string;
  primaryForeground?: string;
  secondary?: string;
  secondaryForeground?: string;
  muted?: string;
  mutedForeground?: string;
  accent?: string;
  accentForeground?: string;
  destructive?: string;
  destructiveForeground?: string;
  border?: string;
  input?: string;
  ring?: string;
  ringFocus?: string;
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;
  sidebar?: string;
  sidebarForeground?: string;
  sidebarPrimary?: string;
  sidebarPrimaryForeground?: string;
  sidebarAccent?: string;
  sidebarAccentForeground?: string;
  sidebarBorder?: string;
  sidebarRing?: string;
  radius?: number;
  shadowScale?: "none" | "subtle" | "default" | "strong";
  fontSans?: string;
  fontSerif?: string;
  fontMono?: string;
  overlayDark30?: string;
  overlayDark50?: string;
  overlayBrandGradientFrom?: string;
};

/**
 * Fetch the Theme document for a given locale.
 * Returns a flat object of theme fields or null if not found.
 */
export async function fetchTheme(params: QueryParams & { lang: string }) {
  return client.fetch<ThemeDoc | null>(THEME_QUERY, params, {
    cache: "force-cache",
    next: { revalidate: 60 },
  });
}

/**
 * Convert a Theme document to a CSS string that sets :root variables.
 * Only defined fields are emitted, so unset fields fall back to globals.css defaults.
 */
export function themeToCssVars(theme: ThemeDoc | null) {
  if (!theme) return "";
  const entries: Array<[string, string]> = [];
  const map: Record<string, string | number | undefined> = {
    // palette
    background: theme.background,
    foreground: theme.foreground,
    card: theme.card,
    cardForeground: theme.cardForeground,
    popover: theme.popover,
    popoverForeground: theme.popoverForeground,
    primary: theme.primary,
    primaryForeground: theme.primaryForeground,
    secondary: theme.secondary,
    secondaryForeground: theme.secondaryForeground,
    muted: theme.muted,
    mutedForeground: theme.mutedForeground,
    accent: theme.accent,
    accentForeground: theme.accentForeground,
    destructive: theme.destructive,
    destructiveForeground: theme.destructiveForeground,
    border: theme.border,
    input: theme.input,
    ring: theme.ring,
    ringFocus: theme.ringFocus,
    // charts
    chart1: theme.chart1,
    chart2: theme.chart2,
    chart3: theme.chart3,
    chart4: theme.chart4,
    chart5: theme.chart5,
    // surfaces
    sidebar: theme.sidebar,
    sidebarForeground: theme.sidebarForeground,
    sidebarPrimary: theme.sidebarPrimary,
    sidebarPrimaryForeground: theme.sidebarPrimaryForeground,
    sidebarAccent: theme.sidebarAccent,
    sidebarAccentForeground: theme.sidebarAccentForeground,
    sidebarBorder: theme.sidebarBorder,
    sidebarRing: theme.sidebarRing,
    // shape & shadow
    radius: theme.radius,
    // We expose a single CSS var for current shadow scale if needed
    // Consumers can map via TS or use it to toggle shadow tokens
    // --shadow-current is optional
    // @ts-ignore: allow number to string coercion in template
    // typography
    fontSans: theme.fontSans,
    fontSerif: theme.fontSerif,
    fontMono: theme.fontMono,
    // overlays
    overlayDark30: theme.overlayDark30,
    overlayDark50: theme.overlayDark50,
    overlayBrandGradientFrom: theme.overlayBrandGradientFrom,
  };

  for (const [key, value] of Object.entries(map)) {
    if (value !== undefined && value !== null && value !== "") {
      entries.push([`--${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`, String(value)]);
    }
  }

  if (entries.length === 0) return "";
  const css = `:root{${entries.map(([k, v]) => `${k}:${v}`).join(";")}}`;
  return css;
}
