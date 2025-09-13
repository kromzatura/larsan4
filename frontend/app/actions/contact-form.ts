"use server";

import { Resend } from "resend";
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

    // Validate the form data
    const validatedData = contactFormSchema.parse(rawData);
    const { firstName, lastName, email, message } = validatedData;

    const html = await render(
      ContactFormEmail({ firstName, lastName, email, message })
    );

    await resend.emails.send({
      from: `Website Contact Form <${process.env.NEXT_RESEND_FROM_EMAIL}>`,
      to: process.env.NEXT_RESEND_TO_EMAIL,
      subject: `New Contact from ${firstName} ${lastName}`,
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
