"use server";

import { Resend } from "resend";
import { contactFormSchema } from "@/lib/schemas/contact-form";
import ContactFormEmail from "@/emails/contact-form";
import { render } from "@react-email/render";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactFormState = {
  success?: boolean;
  error?: string;
  errors?: Record<string, string>;
};

export async function submitContactForm(
  formData: FormData
): Promise<ContactFormState> {
  try {
    // Basic bot checks: honeypot and minimum time on form
    const honeypot = formData.get("website");
    const durationMsRaw = formData.get("durationMs");
    const durationMs =
      typeof durationMsRaw === "string" ? parseInt(durationMsRaw, 10) : 0;
    const MIN_DURATION_MS = 2000;
    if (
      (typeof honeypot === "string" && honeypot.trim().length > 0) ||
      durationMs < MIN_DURATION_MS
    ) {
      return {
        success: false,
        error: "Captcha verification failed. Please try again.",
      };
    }

    // Verify reCAPTCHA if configured
    if (process.env.RECAPTCHA_SECRET_KEY) {
      const token = formData.get("g-recaptcha-response");
      if (!token || typeof token !== "string") {
        return {
          success: false,
          error: "Captcha verification failed. Please try again.",
        };
      }
      const verifyRes = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRET_KEY,
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
          error: "Captcha verification failed. Please try again.",
        };
      }
    }
    if (!process.env.RESEND_API_KEY) {
      throw new Error("Missing Resend API key");
    }
    if (
      !process.env.NEXT_RESEND_FROM_EMAIL ||
      !process.env.NEXT_RESEND_TO_EMAIL
    ) {
      throw new Error("Missing email configuration");
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
      ContactFormEmail({ firstName, lastName, email, message, inquiryItems })
    );
    // (Dev preview removed for simplicity)

    await resend.emails.send({
      from: `Website Contact Form <${process.env.NEXT_RESEND_FROM_EMAIL}>`,
      to: process.env.NEXT_RESEND_TO_EMAIL,
      subject: `New Contact${
        inquiryItems && inquiryItems.length
          ? ` (+${inquiryItems.length} inquiry)`
          : ""
      } from ${firstName} ${lastName}`,
      html,
      replyTo: email,
    });

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
      error: "An unexpected error occurred",
    };
  }
}
