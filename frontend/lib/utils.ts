import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Coerce various content shapes to a displayable string when possible
export function toText(v: unknown): string | null {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (v && typeof v === "object") {
    const obj = v as Record<string, unknown>;
    if (typeof obj.value === "string") return obj.value;
  }
  return null;
}
