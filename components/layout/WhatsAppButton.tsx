import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";

// Sabit hızlı iletişim (tasarım sistemi §4.5). Telefon panelden (Site Ayarları) gelir.
export function WhatsAppButton({ phone }: { phone?: string }) {
  const t = useTranslations("common");
  const number = (phone || "905000000000").replace(/[^0-9]/g, "");
  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp")}
      className="fixed bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-base shadow-amber transition hover:bg-accent-light ltr:right-6 rtl:left-6"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
