import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";

// Statik değerler (v1). Faz 2'de panelden beslenecek.
const items = [
  { key: "years", to: 40, suffix: "+" },
  { key: "routes", to: 12, suffix: "" },
  { key: "deliveries", to: 25000, suffix: "+" },
  { key: "fleet", to: 60, suffix: "+" },
] as const;

export function Stats() {
  const t = useTranslations("stats");
  return (
    <section className="border-y border-border-subtle bg-elevated">
      <Container className="grid grid-cols-2 gap-8 py-16 md:grid-cols-4">
        {items.map((item, i) => (
          <Reveal key={item.key} delay={i * 0.1} className="text-center">
            <div className="font-display text-h1 font-semibold text-accent">
              <Counter to={item.to} suffix={item.suffix} />
            </div>
            <div className="mt-2 text-small text-text-muted">{t(item.key)}</div>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
