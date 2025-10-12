export default {
  inquiry: {
    label: "Inquiry",
  },
  products: {
    table: {
      headerProduct: "Products",
      headerCategory: "Category",
      headerKeyFeatures: "Key features",
      headerAttributes: "Product attributes",
      headerAction: "Action",
      labelSku: "SKU",
      labelPurity: "Purity",
      emptyState: "No products found.",
    },
    categoryFilter: {
      labelFilter: "Filter",
      labelCategory: "Category:",
      labelAny: "Any",
    },
    categoryPage: {
      breadcrumbProducts: "Products",
      breadcrumbCategory: "Category",
      labelSort: "Sort",
      sortNewest: "Newest",
      sortAZ: "A–Z",
      sortZA: "Z–A",
      emptyState: "No products in this category yet.",
    },
    listingBlock: {
      emptyStateCategoryNotFound: "Category not found.",
      emptyStateNoProductsInCategory: "No products found in this category.",
      actionClearFilter: "Clear filter",
      emptyStateGeneral: "No products found.",
    },
  },
  postPage: {
    breadcrumbs: {
      home: "Home",
      blog: "Blog",
      post: "Post",
    },
    authorLine: {
      on: "on",
    },
    readingTime: {
      unit: "min. read",
    },
    toc: {
      title: "On this page",
    },
    share: {
      title: "Share this article",
      facebook: "Share on Facebook",
      twitter: "Share on X (Twitter)",
      linkedin: "Share on LinkedIn",
    },
  },
  productPage: {
    breadcrumbs: {
      products: "Products",
    },
    sections: {
      keyFeatures: "Key features",
      atAGlance: "At a glance",
      quality: "Quality",
      other: "Other",
      packaging: "Packaging",
      categories: "Categories",
    },
    share: {
      title: "Share this product",
      facebook: "Share on Facebook",
      twitter: "Share on X (Twitter)",
      linkedin: "Share on LinkedIn",
    },
    actions: {
      addToInquiry: "Add to Inquiry",
    },
    specLabels: {
      sku: "SKU",
      hsCode: "HS Code",
      minOrder: "Min. order",
      origin: "Origin",
      botanicalName: "Botanical name",
      bestFor: "Best for",
      pungency: "Pungency",
      bindingCapacity: "Binding capacity",
      fatContent: "Fat content",
      moisture: "Moisture",
      shelfLife: "Shelf life",
      allergenInfo: "Allergen info",
      attributes: "Attributes",
      certification: "Certification",
    },
  },
  contact: {
    form: {
      firstNameLabel: "First Name",
      firstNamePlaceholder: "Your First Name",
      lastNameLabel: "Last Name",
      lastNamePlaceholder: "Your Last Name",
      emailLabel: "Email Address",
      emailPlaceholder: "Your Email",
      messageLabel: "Your Message",
      messagePlaceholder: "How can we help you?",
      submit: "Submit",
      sending: "Sending...",
      success: "Message transmitted successfully",
      captchaNotReady: "Captcha not ready. Please try again.",
      captchaFailed: "Captcha verification failed. Please try again.",
    },
    inquiry: {
      itemsLabel: "Inquiry Items",
      sku: "SKU",
    },
  },
  notFound: {
    title: "Page not found",
    backToHome: "Back to Home page",
  },
} as const;
