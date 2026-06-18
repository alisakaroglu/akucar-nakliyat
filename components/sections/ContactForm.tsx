"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "sent";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<Status>("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Placeholder: gerçek gönderim Faz 3'te (Resend/SMTP) veya Faz 2 panel API ile.
    setStatus("sent");
    e.currentTarget.reset();
  }

  const inputCls =
    "h-11 w-full rounded-md border border-border-subtle bg-overlay px-3 text-body text-text-primary placeholder:text-text-faint focus:border-accent focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-small text-text-muted" htmlFor="name">
            {t("name")}
          </label>
          <input id="name" name="name" required className={inputCls} />
        </div>
        <div>
          <label className="mb-2 block text-small text-text-muted" htmlFor="email">
            {t("email")}
          </label>
          <input id="email" name="email" type="email" required className={inputCls} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-small text-text-muted" htmlFor="phone">
            {t("phone")}
          </label>
          <input id="phone" name="phone" className={inputCls} />
        </div>
        <div>
          <label className="mb-2 block text-small text-text-muted" htmlFor="route">
            {t("route")}
          </label>
          <input id="route" name="route" placeholder={t("routePlaceholder")} className={inputCls} />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-small text-text-muted" htmlFor="message">
          {t("message")}
        </label>
        <textarea id="message" name="message" rows={5} required
          className={inputCls.replace("h-11", "min-h-28 py-3")} />
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" size="lg">{t("submit")}</Button>
        {status === "sent" && (
          <span className="text-small text-success" role="status">{t("success")}</span>
        )}
      </div>
    </form>
  );
}
