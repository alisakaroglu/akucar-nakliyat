"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Status = "form" | "sent";

const cargoKeys = ["general", "frigo", "heavy", "container", "other"];
const steps = ["route", "cargo", "contact"] as const;

export function QuoteForm() {
  const t = useTranslations("quote");
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("form");
  const [data, setData] = useState({
    from: "", to: "", cargo: "general", weight: "", date: "",
    name: "", phone: "", email: "",
  });

  const set = (k: string, v: string) => setData((d) => ({ ...d, [k]: v }));

  const canNext =
    (step === 0 && data.from && data.to) ||
    (step === 1 && data.cargo) ||
    step === 2;

  const inputCls =
    "h-11 w-full rounded-md border border-border-subtle bg-overlay px-3 text-body text-text-primary placeholder:text-text-faint focus:border-accent focus:outline-none";
  const label = "mb-2 block text-small text-text-muted";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Placeholder: gerçek gönderim Faz 3 (Resend/SMTP) / Faz 2 panel API.
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-border-subtle bg-elevated p-10 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft">
          <Check className="h-7 w-7 text-accent" />
        </div>
        <h2 className="mt-6 font-display text-h3 font-medium">{t("successTitle")}</h2>
        <p className="mt-3 text-body text-text-muted">{t("successDesc")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-border-subtle bg-elevated p-8 shadow-card">
      {/* Adım göstergesi */}
      <div className="mb-8 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <span
              className={[
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-small font-medium transition",
                i <= step ? "bg-accent text-base" : "bg-overlay text-text-faint",
              ].join(" ")}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <span className="hidden text-small text-text-muted sm:inline">{t(`steps.${s}`)}</span>
            {i < steps.length - 1 && <span className="h-px flex-1 bg-border-subtle" />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="from">{t("from")}</label>
            <input id="from" className={inputCls} value={data.from} onChange={(e) => set("from", e.target.value)} placeholder={t("fromPlaceholder")} />
          </div>
          <div>
            <label className={label} htmlFor="to">{t("to")}</label>
            <input id="to" className={inputCls} value={data.to} onChange={(e) => set("to", e.target.value)} placeholder={t("toPlaceholder")} />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={label} htmlFor="cargo">{t("cargo")}</label>
            <select id="cargo" className={inputCls} value={data.cargo} onChange={(e) => set("cargo", e.target.value)}>
              {cargoKeys.map((c) => (
                <option key={c} value={c}>{t(`cargoTypes.${c}`)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="weight">{t("weight")}</label>
            <input id="weight" className={inputCls} value={data.weight} onChange={(e) => set("weight", e.target.value)} placeholder={t("weightPlaceholder")} />
          </div>
          <div>
            <label className={label} htmlFor="date">{t("date")}</label>
            <input id="date" type="date" className={inputCls} value={data.date} onChange={(e) => set("date", e.target.value)} />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={label} htmlFor="name">{t("name")}</label>
            <input id="name" required className={inputCls} value={data.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="phone">{t("phone")}</label>
            <input id="phone" className={inputCls} value={data.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="email">{t("email")}</label>
            <input id="email" type="email" required className={inputCls} value={data.email} onChange={(e) => set("email", e.target.value)} />
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between gap-4">
        {step > 0 ? (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="inline-flex items-center gap-2 text-small text-text-muted hover:text-text-primary">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("back")}
          </button>
        ) : <span />}

        {step < steps.length - 1 ? (
          <Button type="button" onClick={() => canNext && setStep((s) => s + 1)} className={!canNext ? "pointer-events-none opacity-50" : ""}>
            {t("next")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        ) : (
          <Button type="submit">{t("submit")}</Button>
        )}
      </div>
    </form>
  );
}
