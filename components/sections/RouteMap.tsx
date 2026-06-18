"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

// Animasyonlu rota: Hatay → Beyrut → Şam (tasarım sistemi §5).
const stops = [
  { key: "hatay", x: 120, y: 90 },
  { key: "beirut", x: 360, y: 200 },
  { key: "damascus", x: 600, y: 150 },
];

export function RouteMap() {
  const t = useTranslations("route");

  return (
    <section className="border-y border-border-subtle bg-elevated py-20 md:py-30">
      <Container>
        <Reveal>
          <span className="overline">{t("overline")}</span>
          <h2 className="mt-3 max-w-prose font-display text-h2 font-semibold">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-prose text-body text-text-muted">{t("lead")}</p>
        </Reveal>

        <div className="mt-12 overflow-hidden rounded-lg border border-border-subtle bg-base">
          <svg
            viewBox="0 0 720 280"
            className="h-auto w-full"
            role="img"
            aria-label={t("title")}
          >
            <motion.path
              d="M120 90 Q 240 240 360 200 T 600 150"
              fill="none"
              stroke="#D4A24E"
              strokeWidth="2.5"
              strokeDasharray="2 8"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0.2 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            {stops.map((s, i) => (
              <g key={s.key}>
                <motion.circle
                  cx={s.x}
                  cy={s.y}
                  r="18"
                  fill="rgba(232,180,90,0.15)"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.5, type: "spring" }}
                />
                <motion.circle
                  cx={s.x}
                  cy={s.y}
                  r="6"
                  fill="#D4A24E"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.5, type: "spring" }}
                />
                <text
                  x={s.x}
                  y={s.y - 28}
                  textAnchor="middle"
                  className="fill-text-primary font-sans"
                  fontSize="16"
                >
                  {t(`stops.${s.key}`)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </Container>
    </section>
  );
}
