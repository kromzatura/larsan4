export default {
  inquiry: {
    label: "Inquiry",
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
