"use client";

import { Form, FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import Script from "next/script";
import { useLocale } from "@/lib/i18n/locale-context";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/schemas/contact-form";
import { type ContactFormState } from "@/app/actions/contact-form";
import type { SupportedLocale } from "@/lib/i18n/config";

interface ContactFormProps {
  onSubmit: (formData: FormData) => Promise<ContactFormState>;
  children?: React.ReactNode;
  onSuccess?: () => void; // optional callback when submission succeeds
  locale?: SupportedLocale; // optional explicit locale override when provider isn't present
}

export function ContactForm({
  onSubmit,
  children,
  onSuccess,
  locale: localeProp,
}: ContactFormProps) {
  const localeFromContext = useLocale();
  const locale = localeProp ?? localeFromContext;
  const dict = getDictionary(locale);
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<ContactFormState>({});
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const requireCaptcha = process.env.NEXT_PUBLIC_RECAPTCHA_REQUIRED === "true";
  const captchaRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  const resolveTokenRef = useRef<((token: string) => void) | null>(null);
  const mountTime = useMemo(() => Date.now(), []);

  // reCAPTCHA helper types and accessor (shared between effect + submit handler)
  type Grecaptcha = {
    ready: (cb: () => void) => void;
    render: (
      container: HTMLElement,
      params: {
        sitekey: string;
        size: "invisible";
        callback: (token: string) => void;
      }
    ) => number;
    reset: (id?: number) => void;
    execute: (id?: number) => void;
  };
  const getGrecaptcha = useCallback((): Grecaptcha | null => {
    if (typeof window === "undefined") return null;
    const globalWindow = window as typeof window & { grecaptcha?: Grecaptcha };
    return globalWindow.grecaptcha ?? null;
  }, []);

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
      const grecaptcha = getGrecaptcha();
      const container = captchaRef.current;
      if (!grecaptcha || !container || widgetIdRef.current !== null) {
        return;
      }
      try {
        grecaptcha.ready(() => {
          if (widgetIdRef.current !== null) return;
          // captchaRef.current is guaranteed non-null due to guard above
          widgetIdRef.current = grecaptcha.render(container, {
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
  }, [getGrecaptcha, siteKey]);

  // Unified token retrieval that supports v2 invisible (widget) and v3 fallback
  async function getRecaptchaToken(): Promise<string> {
    const grecaptcha = getGrecaptcha();
    if (!siteKey || !grecaptcha) return "";
    // Try v2 invisible via widget if available
    if (widgetIdRef.current != null) {
      try {
        const token = await new Promise<string>((resolve) => {
          // Timeout as a safety valve
          const timeout = window.setTimeout(() => resolve(""), 8000);
          resolveTokenRef.current = (t: string) => {
            window.clearTimeout(timeout);
            resolve(t);
          };
          try {
            const execResult = grecaptcha.execute(
              widgetIdRef.current ?? undefined
            );
            Promise.resolve(execResult).catch(() => {
              // swallow; resolve via callback
            });
          } catch {
            window.clearTimeout(timeout);
            resolve("");
          }
        });
        resolveTokenRef.current = null;
        if (token) return token;
      } catch {
        // fall through to v3
      }
    }
    // Fallback: try v3 style execute
    try {
      const anyG = grecaptcha as unknown as {
        execute: (
          siteKey: string,
          params?: { action?: string }
        ) => Promise<string> | string;
        ready: (cb: () => void) => void;
      };
      await new Promise<void>((r) => anyG.ready(() => r()));
      const maybePromise = anyG.execute(siteKey, { action: "contact" });
      const token = await Promise.resolve(maybePromise).catch(() => "");
      return typeof token === "string" ? token : "";
    } catch {
      return "";
    }
  }

  async function handleAction(formData: FormData) {
    form.clearErrors();
    startTransition(async () => {
      // Add timing info
      const durationMs = Math.max(0, Date.now() - mountTime);
      formData.set("durationMs", String(durationMs));

      if (
        requireCaptcha &&
        siteKey &&
        typeof window !== "undefined" &&
        getGrecaptcha()
      ) {
        const grecaptcha = getGrecaptcha();
        if (!siteKey || !grecaptcha) {
          setFormState({ error: dict.contact.form.captchaNotReady });
          return;
        }
        const token = await getRecaptchaToken();
        if (!token) {
          setFormState({ error: dict.contact.form.captchaFailed });
          return;
        }
        formData.set("g-recaptcha-response", token);
      }
      try {
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
            } catch {
              form.setError(fieldKey, {
                type: "server",
                message,
              });
            }
          });
        }
      } catch (e) {
        const message =
          e instanceof Error && e.message
            ? e.message
            : dict.contact.form.unexpectedError;
        console.error("Contact form submission failed:", e);
        setFormState({ success: false, error: message });
      }
    });
  }

  return (
    <Form {...form}>
      <form
        action={handleAction}
        className="space-y-6"
        suppressHydrationWarning
      >
        {/* Ensure server action receives the active locale */}
        <input type="hidden" name="locale" value={locale} />
        {siteKey && (
          <Script
            src="https://www.google.com/recaptcha/api.js?render=explicit"
            async
            defer
            strategy="afterInteractive"
          />
        )}
        {children}
        {/* Honeypot field: visually hidden but present in DOM */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            autoComplete="off"
            tabIndex={-1}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            data-ms-editor="false"
            data-gramm="false"
            suppressHydrationWarning
          />
        </div>
        {formState.success && (
          <div className="p-4 border border-green-500 bg-green-50 text-green-700 rounded-md">
            {dict.contact.form.success}
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
              {dict.contact.form.firstNameLabel}
              <sup className="ml-0.5">*</sup>
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                id="firstName"
                placeholder={dict.contact.form.firstNamePlaceholder}
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
              {dict.contact.form.lastNameLabel}
              <sup className="ml-0.5">*</sup>
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                id="lastName"
                placeholder={dict.contact.form.lastNamePlaceholder}
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
            {dict.contact.form.emailLabel}
            <sup className="ml-0.5">*</sup>
          </FormLabel>
          <FormControl>
            <Input
              type="email"
              id="email"
              placeholder={dict.contact.form.emailPlaceholder}
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
            {dict.contact.form.messageLabel}
            <sup className="ml-0.5">*</sup>
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={dict.contact.form.messagePlaceholder}
              id="message"
              {...form.register("message")}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              data-ms-editor="false"
              data-gramm="false"
              suppressHydrationWarning
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
          {isPending ? dict.contact.form.sending : dict.contact.form.submit}
        </Button>
      </form>
    </Form>
  );
}
