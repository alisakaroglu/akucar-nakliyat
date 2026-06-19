import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import type { StatItem } from "@/lib/content";

export function Stats({ items }: { items: StatItem[] }) {
  return (
    <section className="border-y border-border-subtle bg-elevated">
      <Container className="grid grid-cols-2 gap-8 py-16 md:grid-cols-4">
        {items.map((item, i) => (
          <Reveal key={item.key} delay={i * 0.1} className="text-center">
            <div className="font-display text-h1 font-semibold text-accent">
              <Counter to={item.value} suffix={item.suffix} />
            </div>
            <div className="mt-2 text-small text-text-muted">{item.label}</div>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
