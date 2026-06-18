import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";

// Kayan referans logosu şeridi (placeholder). Gerçek logolar v2/v3.
export function ReferenceStrip() {
  const t = useTranslations("refStrip");
  const logos = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <section className="border-b border-border-subtle py-16">
      <Container>
        <p className="text-center text-overline uppercase text-text-faint">
          {t("title")}
        </p>
      </Container>
      <div className="group relative mt-8 overflow-hidden">
        <div className="flex w-max animate-marquee gap-16 px-8">
          {[...logos, ...logos].map((n, i) => (
            <span
              key={i}
              className="font-display text-h3 text-text-faint/60"
              aria-hidden={i >= logos.length}
            >
              LOGO
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
