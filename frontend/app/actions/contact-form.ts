"use server";

import { Resend } from "resend";
import { setLastContactEmailHtml } from "@/lib/dev-email-store";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/schemas/contact-form";
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

    let inquiryItems: { id: string; name?: string | null }[] | undefined;
    const inquiryRaw = formData.get("inquiryItems");
    if (typeof inquiryRaw === "string" && inquiryRaw.length > 0) {
      try {
        const decoded = decodeURIComponent(inquiryRaw);
        const parsed = JSON.parse(decoded);
        if (Array.isArray(parsed)) {
          inquiryItems = parsed
            .filter((x) => x && typeof x.id === "string")
            .map((x) => ({ id: x.id as string, name: typeof x.name === "string" ? x.name : null }));
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
    if (process.env.NODE_ENV !== "production") {
      setLastContactEmailHtml(html);
      console.info("[contact-form] Rendered email HTML length:", html.length);
      if (inquiryItems?.length) {
        console.info("[contact-form] Inquiry items included:", inquiryItems.length);
      }
    }

    await resend.emails.send({
      from: `Website Contact Form <${process.env.NEXT_RESEND_FROM_EMAIL}>`,
      to: process.env.NEXT_RESEND_TO_EMAIL,
      subject: `New Contact${inquiryItems && inquiryItems.length ? ` (+${inquiryItems.length} inquiry)` : ""} from ${firstName} ${lastName}`,
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
