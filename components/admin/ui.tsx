"use client";

import { useState, type ReactNode } from "react";
import { X } from "lucide-react";

// --- Modal ---
export function Modal({
  open, onClose, title, children, footer, wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-base/70 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div
        className={`w-full ${wide ? "max-w-3xl" : "max-w-xl"} rounded-xl border border-border-subtle bg-elevated shadow-card`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <h2 className="font-display text-h4 font-medium">{title}</h2>
          <button onClick={onClose} aria-label="Kapat" className="text-text-muted hover:text-text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-6">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-border-subtle px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Buton ---
export function Button({
  children, variant = "primary", className = "", ...props
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const v = {
    primary: "bg-accent text-base hover:bg-accent-light",
    secondary: "border border-border-subtle text-text-primary hover:border-accent hover:text-accent",
    danger: "bg-danger/15 text-danger hover:bg-danger/25",
    ghost: "text-text-muted hover:text-text-primary",
  }[variant];
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-small font-medium transition disabled:opacity-60 ${v} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// --- Çok dilli alan (TR/EN/AR sekmeli) ---
type Loc = { tr?: string; en?: string; ar?: string };
const langs: { key: keyof Loc; label: string }[] = [
  { key: "tr", label: "TR" },
  { key: "en", label: "EN" },
  { key: "ar", label: "AR" },
];

export function LocalizedInput({
  label, value, onChange, textarea, placeholder,
}: {
  label: string;
  value: Loc;
  onChange: (v: Loc) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  const [tab, setTab] = useState<keyof Loc>("tr");
  const base =
    "w-full rounded-md border border-border-subtle bg-overlay px-3 py-2.5 text-body text-text-primary placeholder:text-text-faint focus:border-accent focus:outline-none";
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-small text-text-muted">{label}</label>
        <div className="flex gap-1">
          {langs.map((l) => (
            <button
              type="button"
              key={l.key}
              onClick={() => setTab(l.key)}
              className={[
                "rounded px-2 py-0.5 text-overline uppercase transition",
                tab === l.key ? "bg-accent text-base" : "text-text-faint hover:text-text-muted",
                value[l.key] ? "ring-1 ring-accent/40" : "",
              ].join(" ")}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
      {textarea ? (
        <textarea
          rows={4}
          dir={tab === "ar" ? "rtl" : "ltr"}
          value={value[tab] ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange({ ...value, [tab]: e.target.value })}
          className={base}
        />
      ) : (
        <input
          dir={tab === "ar" ? "rtl" : "ltr"}
          value={value[tab] ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange({ ...value, [tab]: e.target.value })}
          className={`h-11 ${base}`}
        />
      )}
    </div>
  );
}

export const fieldInput =
  "h-11 w-full rounded-md border border-border-subtle bg-overlay px-3 text-body text-text-primary placeholder:text-text-faint focus:border-accent focus:outline-none";
