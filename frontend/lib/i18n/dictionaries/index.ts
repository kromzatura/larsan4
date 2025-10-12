import type { SupportedLocale } from "../config";
import en from "./en";
import nl from "./nl";

export type UIDictionary = {
  inquiry: {
    label: string;
  };
  products: {
    table: {
      headerProduct: string;
      headerCategory: string;
      headerKeyFeatures: string;
      headerAttributes: string;
      headerAction: string;
      labelSku: string;
      labelPurity: string;
      emptyState: string;
    };
    categoryFilter: {
      labelFilter: string;
      labelCategory: string;
      labelAny: string;
    };
    categoryPage: {
      breadcrumbProducts: string;
      breadcrumbCategory: string;
      labelSort: string;
      sortNewest: string;
      sortAZ: string;
      sortZA: string;
      emptyState: string;
    };
    listingBlock: {
      emptyStateCategoryNotFound: string;
      emptyStateNoProductsInCategory: string;
      actionClearFilter: string;
      emptyStateGeneral: string;
    };
  };
  postPage: {
    breadcrumbs: {
      home: string;
      blog: string;
      post: string;
    };
    authorLine: {
      on: string;
    };
    readingTime: {
      unit: string;
    };
    toc: {
      title: string;
    };
    share: {
      title: string;
      facebook: string;
      twitter: string;
      linkedin: string;
    };
  };
  productPage: {
    breadcrumbs: {
      products: string;
    };
    sections: {
      keyFeatures: string;
      atAGlance: string;
      quality: string;
      other: string;
      packaging: string;
      categories: string;
    };
    share: {
      title: string;
      facebook: string;
      twitter: string;
      linkedin: string;
    };
    actions: {
      addToInquiry: string;
    };
    specLabels: {
      sku: string;
      hsCode: string;
      minOrder: string;
      origin: string;
      botanicalName: string;
      bestFor: string;
      pungency: string;
      bindingCapacity: string;
      fatContent: string;
      moisture: string;
      shelfLife: string;
      allergenInfo: string;
      attributes: string;
      certification: string;
    };
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
  notFound: {
    title: string;
    backToHome: string;
  };
};

const MAP: Record<SupportedLocale, UIDictionary> = {
  en,
  nl,
};

export function getDictionary(locale: SupportedLocale): UIDictionary {
  return MAP[locale] ?? en;
}
