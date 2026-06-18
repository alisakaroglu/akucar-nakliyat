import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

// Tutarlı bölüm sarmalayıcı (dikey ritim + opsiyonel başlık).
export function Section({
  overline,
  title,
  children,
  className,
}: {
  overline?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={["py-20 md:py-30", className].filter(Boolean).join(" ")}>
      <Container>
        {(overline || title) && (
          <div className="mb-12">
            {overline && <span className="overline">{overline}</span>}
            {title && (
              <h2 className="mt-3 font-display text-h2 font-semibold">{title}</h2>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
