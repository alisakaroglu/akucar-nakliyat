"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";

export function NewsletterForm() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "ok" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setState("idle");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      if (!res.ok) throw new Error();
      setState("ok");
      setEmail("");
    } catch {
      setState("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4">
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("newsletterPlaceholder")}
          className="h-11 w-full rounded-md border border-border-subtle bg-overlay px-3 text-small text-text-primary placeholder:text-text-faint focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="h-11 shrink-0 rounded-md bg-accent px-4 text-small font-medium text-base transition hover:bg-accent-light disabled:opacity-60"
        >
          {t("subscribe")}
        </button>
      </div>
      {state === "ok" && <p className="mt-2 text-small text-success">{t("newsletterSuccess")}</p>}
      {state === "error" && <p className="mt-2 text-small text-danger">{t("newsletterError")}</p>}
    </form>
  );
}
