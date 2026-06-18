import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";

// Sabit hızlı iletişim (tasarım sistemi §4.5). RTL'de start/end ile konum çevrilir.
export function WhatsAppButton() {
  const t = useTranslations("common");
  const phone = "905000000000"; // TODO: gerçek numara (müşteriden) — Faz 3
  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp")}
      className="fixed bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-base shadow-amber transition hover:bg-accent-light ltr:right-6 rtl:left-6"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
