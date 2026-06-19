import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { getIcon } from "@/lib/icons";
import type { ServiceCard } from "@/lib/content";

// Hizmet kartı gridi — veri-güdümlü (DB veya statik fallback). Anasayfa + /hizmetler ortak (DRY).
export function ServicesGrid({ items, moreLabel }: { items: ServiceCard[]; moreLabel: string }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((s, i) => {
        const Icon = getIcon(s.icon);
        return (
          <Reveal key={s.slug} delay={i * 0.08}>
            <Link
              href={`/hizmetler/${s.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-border-subtle bg-elevated shadow-card transition duration-300 hover:-translate-y-1 hover:border-accent/60"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-elevated via-elevated/30 to-transparent" />
                <span className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-md bg-base/70 backdrop-blur-sm">
                  <Icon className="h-6 w-6 text-accent" aria-hidden />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-8">
                <h3 className="font-display text-h4 font-medium">{s.title}</h3>
                <p className="mt-3 flex-1 text-body text-text-muted">{s.desc}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-small text-accent">
                  {moreLabel}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
