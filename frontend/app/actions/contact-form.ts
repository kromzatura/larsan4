"use server";

import { Resend } from "resend";
import { contactFormSchema } from "@/lib/schemas/contact-form";
import ContactFormEmail from "@/emails/contact-form";
import { render } from "@react-email/render";
import { z } from "zod";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

// Lazily create client to avoid top-level issues during hot-reload
function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export type ContactFormState = {
  success?: boolean;
  error?: string;
  errors?: Record<string, string>;
};

export async function submitContactForm(
  formData: FormData
): Promise<ContactFormState> {
  try {
    const isProd = process.env.NODE_ENV === "production";
    const recaptchaVerifyInDev = process.env.RECAPTCHA_VERIFY_IN_DEV === "true";
    const haveRecaptchaKeys =
      !!process.env.RECAPTCHA_SECRET_KEY &&
      !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    // Only verify captcha in production by default. In non-production, require an explicit flag
    // RECAPTCHA_VERIFY_IN_DEV=true to opt-in to verification.
    const shouldVerifyRecaptcha = isProd
      ? haveRecaptchaKeys
      : recaptchaVerifyInDev && haveRecaptchaKeys;
    // Determine locale from form (fallback-safe)
    const rawLocale = formData.get("locale");
    const locale: SupportedLocale = SUPPORTED_LOCALES.includes(
      rawLocale as SupportedLocale
    )
      ? (rawLocale as SupportedLocale)
      : DEFAULT_LOCALE;
    const dict = getDictionary(locale);

    // Basic bot checks: honeypot and minimum time on form
    const honeypot = formData.get("website");
    const durationMsRaw = formData.get("durationMs");
    const durationMs =
      typeof durationMsRaw === "string" ? parseInt(durationMsRaw, 10) : 0;
    // When captcha verification is disabled (typical for local/dev), apply a small
    // minimum time-on-form heuristic to reduce bot spam. Keep this lenient to avoid
    // flagging real users during testing.
    const MIN_DURATION_MS = 0;
    if (typeof honeypot === "string" && honeypot.trim().length > 0) {
      return {
        success: false,
        error: dict.contact.form.captchaFailed,
      };
    }
    if (!shouldVerifyRecaptcha && durationMs < MIN_DURATION_MS) {
      return {
        success: false,
        error: dict.contact.form.captchaFailed,
      };
    }

    // Verify reCAPTCHA only if both secret and site key are configured
    if (shouldVerifyRecaptcha) {
      const token = formData.get("g-recaptcha-response");
      if (!token || typeof token !== "string") {
        return {
          success: false,
          error: dict.contact.form.captchaFailed,
        };
      }
      const verifyRes = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRET_KEY as string,
            response: token,
          }).toString(),
          // reCAPTCHA endpoint is external
          cache: "no-store",
        }
      );
      type RecaptchaVerifyResponse = {
        success?: boolean;
        challenge_ts?: string;
        hostname?: string;
        score?: number;
        action?: string;
        "error-codes"?: string[];
      };
      const verifyJson = (await verifyRes.json()) as RecaptchaVerifyResponse;
      if (!verifyJson.success) {
        return {
          success: false,
          error: dict.contact.form.captchaFailed,
        };
      }
    }
    // Email configuration
    const hasResendKey = !!process.env.RESEND_API_KEY;
    const fromEmail = process.env.NEXT_RESEND_FROM_EMAIL;
    const toEmail = process.env.NEXT_RESEND_TO_EMAIL;
    const hasEmailConfig = !!fromEmail && !!toEmail;
    if (!hasResendKey || !hasEmailConfig) {
      if (isProd) {
        if (!hasResendKey) throw new Error("Missing Resend API key");
        throw new Error("Missing email configuration");
      }
      // In non-production, simulate success so local testing doesn’t block
      console.warn("[contact-form] Email not sent (dev simulation):", {
        hasResendKey,
        hasEmailConfig,
        fromEmail,
        toEmail,
      });
      return { success: true };
    }

    // Convert FormData to object
    const rawData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    let inquiryItems:
      | {
          id: string;
          name?: string | null;
          productId?: string | null;
          slug?: string | null;
          imageUrl?: string | null;
        }[]
      | undefined;
    const inquiryRaw = formData.get("inquiryItems");
    if (typeof inquiryRaw === "string" && inquiryRaw.length > 0) {
      try {
        const decoded = decodeURIComponent(inquiryRaw);
        const parsed = JSON.parse(decoded);
        if (Array.isArray(parsed)) {
          inquiryItems = parsed
            .filter((x) => x && typeof x.id === "string")
            .map((x) => ({
              id: x.id as string,
              name: typeof x.name === "string" ? x.name : null,
              productId:
                typeof x.productId === "string"
                  ? (x.productId as string)
                  : null,
              slug: typeof x.slug === "string" ? (x.slug as string) : null,
              imageUrl:
                typeof x.imageUrl === "string" ? (x.imageUrl as string) : null,
            }));
        }
      } catch {
        // ignore malformed inquiry items
      }
    }

    // Validate the form data
    const validatedData = contactFormSchema.parse(rawData);
    const { firstName, lastName, email, message } = validatedData;

    const html = await render(
      ContactFormEmail({
        firstName,
        lastName,
        email,
        message,
        inquiryItems,
        locale,
      })
    );
    // (Dev preview removed for simplicity)

    const resend = getResend();
    const sendResult = await resend.emails.send({
      from: `Website Contact Form <${process.env.NEXT_RESEND_FROM_EMAIL}>`,
      to: process.env.NEXT_RESEND_TO_EMAIL!,
      subject:
        inquiryItems && inquiryItems.length
          ? `${dict.contact.email.headingSubmission} — ${firstName} ${lastName} (+${inquiryItems.length})`
          : `${dict.contact.email.headingSubmission} — ${firstName} ${lastName}`,
      html,
      replyTo: email,
    });
    if (!isProd) {
      console.log("[contact-form] Email sent via Resend (dev):", {
        id: (sendResult as any)?.id,
        to: toEmail,
      });
    }

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, err) => {
        const path = err.path[0] as string;
        acc[path] = err.message;
        return acc;
      }, {} as Record<string, string>);

      return {
        success: false,
        errors,
      };
    }

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: getDictionary(DEFAULT_LOCALE).contact.form.captchaFailed,
    };
  }
}
