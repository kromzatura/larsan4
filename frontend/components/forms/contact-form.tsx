"use client";

import { Form, FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState, useTransition } from "react";
import Script from "next/script";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/schemas/contact-form";
import { type ContactFormState } from "@/app/actions/contact-form";

interface ContactFormProps {
  onSubmit: (formData: FormData) => Promise<ContactFormState>;
  children?: React.ReactNode;
  onSuccess?: () => void; // optional callback when submission succeeds
}

export function ContactForm({
  onSubmit,
  children,
  onSuccess,
}: ContactFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<ContactFormState>({});
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const captchaRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  const resolveTokenRef = useRef<((token: string) => void) | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!siteKey) return;
    const tryInit = () => {
      const grecaptcha = (window as any)?.grecaptcha;
      if (!grecaptcha || !captchaRef.current || widgetIdRef.current !== null) {
        return;
      }
      try {
        grecaptcha.ready(() => {
          if (widgetIdRef.current !== null) return;
          widgetIdRef.current = grecaptcha.render(captchaRef.current, {
            sitekey: siteKey,
            size: "invisible",
            callback: (token: string) => {
              resolveTokenRef.current?.(token);
            },
          });
        });
      } catch {}
    };
    tryInit();
    const id = window.setInterval(tryInit, 500);
    return () => window.clearInterval(id);
  }, [siteKey]);

  async function handleAction(formData: FormData) {
    form.clearErrors();
    startTransition(async () => {
      if (
        siteKey &&
        typeof window !== "undefined" &&
        (window as any).grecaptcha
      ) {
        const grecaptcha = (window as any).grecaptcha;
        if (widgetIdRef.current == null) {
          setFormState({ error: "Captcha not ready. Please try again." });
          return;
        }
        const token = await new Promise<string>((resolve) => {
          resolveTokenRef.current = resolve;
          try {
            grecaptcha.reset(widgetIdRef.current);
            grecaptcha.execute(widgetIdRef.current);
          } catch {
            resolve("");
          }
        });
        if (!token) {
          setFormState({
            error: "Captcha verification failed. Please try again.",
          });
          return;
        }
        formData.set("g-recaptcha-response", token);
      }
      const result = await onSubmit(formData);
      setFormState(result);

      if (result.success) {
        form.reset();
        onSuccess?.();
      } else if (result.errors) {
        const currentValues = form.getValues();
        Object.entries(result.errors).forEach(([key, message]) => {
          const fieldKey = key as keyof ContactFormValues;
          const fieldValue = currentValues[fieldKey];
          try {
            contactFormSchema.shape[fieldKey].parse(fieldValue);
          } catch (e) {
            form.setError(fieldKey, {
              type: "server",
              message,
            });
          }
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form action={handleAction} className="space-y-6">
        {siteKey && (
          <Script
            src="https://www.google.com/recaptcha/api.js"
            async
            defer
            strategy="afterInteractive"
          />
        )}
        {children}
        {formState.success && (
          <div className="p-4 border border-green-500 bg-green-50 text-green-700 rounded-md">
            Message transmitted successfully
          </div>
        )}
        {formState.error && (
          <div className="p-4 border border-red-500 bg-red-50 text-red-700 rounded-md">
            {formState.error}
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid w-full items-center gap-1.5">
            <FormLabel htmlFor="firstName">
              First Name<sup className="ml-0.5">*</sup>
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                id="firstName"
                placeholder="Your First Name"
                {...form.register("firstName")}
              />
            </FormControl>
            {form.formState.errors.firstName && (
              <p className="text-sm text-red-500">
                {form.formState.errors.firstName.message}
              </p>
            )}
          </div>
          <div className="grid w-full items-center gap-1.5">
            <FormLabel htmlFor="lastName">
              Last Name<sup className="ml-0.5">*</sup>
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                id="lastName"
                placeholder="Your Last Name"
                {...form.register("lastName")}
              />
            </FormControl>
            {form.formState.errors.lastName && (
              <p className="text-sm text-red-500">
                {form.formState.errors.lastName.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <FormLabel htmlFor="email">
            Email Address<sup className="ml-0.5">*</sup>
          </FormLabel>
          <FormControl>
            <Input
              type="email"
              id="email"
              placeholder="Your Email"
              {...form.register("email")}
            />
          </FormControl>
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="grid w-full gap-1.5">
          <FormLabel htmlFor="message">
            Your Message<sup className="ml-0.5">*</sup>
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder="How can we help you?"
              id="message"
              {...form.register("message")}
            />
          </FormControl>
          {form.formState.errors.message && (
            <p className="text-sm text-red-500">
              {form.formState.errors.message.message}
            </p>
          )}
        </div>
        {siteKey && (
          <div className="pt-2">
            <div ref={captchaRef} />
          </div>
        )}
        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? "Sending..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
