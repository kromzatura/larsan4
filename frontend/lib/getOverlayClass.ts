/**
 * Map an image treatment (from Sanity) to an overlay utility class.
 * Returns undefined if no overlay should be applied.
 */
export type OverlayTreatment = "none" | "dark-30" | "dark-50" | "brand-gradient" | undefined;

export function getOverlayClass(treatment: OverlayTreatment) {
  switch (treatment) {
    case "dark-50":
      return "overlay-dark-50";
    case "dark-30":
      return "overlay-dark-30";
    case "brand-gradient":
      return "overlay-brand-gradient";
    case "none":
    default:
      return undefined;
  }
}
