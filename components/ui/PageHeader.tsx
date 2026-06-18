import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

// Tüm iç sayfalar için tek kalıp (tasarım sistemi tutarlılığı). Opsiyonel arka plan görseli.
export function PageHeader({
  overline,
  title,
  description,
  image,
}: {
  overline?: string;
  title: string;
  description?: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border-subtle">
      {image ? (
        <div className="absolute inset-0" aria-hidden>
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-base/75" />
          <div className="absolute inset-0 bg-hero-fade" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-amber-glow opacity-40" aria-hidden />
      )}
      <Container className="relative py-20 md:py-30">
        <Reveal>
          {overline && <span className="overline">{overline}</span>}
          <h1 className="mt-3 max-w-prose font-display text-h1 font-semibold leading-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-prose text-body-lg text-text-muted">
              {description}
            </p>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
