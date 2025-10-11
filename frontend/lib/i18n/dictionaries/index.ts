import type { SupportedLocale } from "../config";
import en from "./en";
import nl from "./nl";

export type UIDictionary = {
  inquiry: {
    label: string;
  };
  contact: {
    form: {
      firstNameLabel: string;
      firstNamePlaceholder: string;
      lastNameLabel: string;
      lastNamePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      submit: string;
      sending: string;
      success: string;
      captchaNotReady: string;
      captchaFailed: string;
    };
    inquiry: {
      itemsLabel: string;
      sku: string;
    };
  };
};

const MAP: Record<SupportedLocale, UIDictionary> = {
  en,
  nl,
};

export function getDictionary(locale: SupportedLocale): UIDictionary {
  return MAP[locale] ?? en;
}
