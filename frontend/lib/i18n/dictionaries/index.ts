import type { SupportedLocale } from "../config";
import en from "./en";
import nl from "./nl";

export type UIDictionary = {
  inquiry: {
    label: string;
    clearAll?: string;
    empty?: string;
    continue?: string;
    send?: string;
    browse?: string;
  };
  products: {
    productCallout: {
      viewProduct: string;
    };
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
      tradeLogistics: string;
      physicalProperties: string;
      qualitySpecs: string;
      nutritionPer100g: string;
      certificationsCompliance: string;
      productData: string;
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
      addedToInquiry: string;
    };
    toasts: {
      added: string;
      already: string;
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
      purity: string;
      moisture: string;
      shelfLife: string;
      allergenInfo: string;
      attributes: string;
      seedSize: string;
      color: string;
      energy: string;
      protein: string;
      carbohydrates: string;
      fiber: string;
      magnesium: string;
      phosphorus: string;
      unit_g: string;
      unit_mg: string;
      unit_kcal: string;
      yes: string;
      no: string;
      ifsBrokerCertified: string;
      glutenFreeCertified: string;
      gmoFree: string;
      pesticideFreeTested: string;
      euFoodSafetyStandards: string;
      haccpCompliant: string;
      halalSuitable: string;
      veganSuitable: string;
      kosherSuitable: string;
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
      unexpectedError: string;
    };
    inquiry: {
      itemsLabel: string;
      sku: string;
    };
    email: {
      headingSubmission: string;
      preview: string;
      labelName: string;
      labelEmail: string;
      labelMessage: string;
      footerAutomated: string;
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
