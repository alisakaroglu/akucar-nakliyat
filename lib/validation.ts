import { z } from "zod";

// Çok dilli alan: en az bir dil dolu olmalı.
export const localizedString = z
  .object({
    tr: z.string().trim().optional(),
    en: z.string().trim().optional(),
    ar: z.string().trim().optional(),
  })
  .refine((v) => v.tr || v.en || v.ar, { message: "En az bir dil zorunlu" });

export const localizedList = z.object({
  tr: z.array(z.string()).optional(),
  en: z.array(z.string()).optional(),
  ar: z.array(z.string()).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const serviceCreateSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "küçük harf, rakam ve tire"),
  icon: z.string().optional(),
  title: localizedString,
  desc: localizedString,
  intro: localizedString.optional(),
  body: localizedString.optional(),
  features: localizedList.optional(),
  image: z.string().url().optional().or(z.literal("")),
  order: z.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
});

export const serviceUpdateSchema = serviceCreateSchema.partial();

export const quoteSchema = z.object({
  fromCity: z.string().max(120).optional(),
  toCity: z.string().max(120).optional(),
  cargoType: z.string().max(60).optional(),
  weight: z.string().max(60).optional(),
  date: z.string().datetime().optional().or(z.literal("")),
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  message: z.string().max(2000).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  route: z.string().max(160).optional(),
  message: z.string().min(2).max(2000),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
  locale: z.string().max(5).optional(),
});

export const newsCreateSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "küçük harf, rakam ve tire"),
  title: localizedString,
  excerpt: localizedString,
  body: localizedString,
  coverImage: z.string().url().optional().or(z.literal("")),
  category: z.string().max(60).optional().or(z.literal("")),
  publishedAt: z.string().datetime().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export const newsUpdateSchema = newsCreateSchema.partial();

export const teamCreateSchema = z.object({
  name: z.string().min(2).max(120),
  role: localizedString,
  photoUrl: z.string().url().optional().or(z.literal("")),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});
export const teamUpdateSchema = teamCreateSchema.partial();

export const faqCreateSchema = z.object({
  question: localizedString,
  answer: localizedString,
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});
export const faqUpdateSchema = faqCreateSchema.partial();

export const referenceCreateSchema = z.object({
  name: localizedString,
  logoUrl: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});
export const referenceUpdateSchema = referenceCreateSchema.partial();

export const heroCreateSchema = z.object({
  title: localizedString,
  subtitle: localizedString.optional(),
  image: z.string().url(),
  ctaHref: z.string().max(200).optional().or(z.literal("")),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});
export const heroUpdateSchema = heroCreateSchema.partial();

export const statCreateSchema = z.object({
  key: z.string().min(1).max(40).regex(/^[a-z0-9_]+$/, "küçük harf, rakam, alt çizgi"),
  label: localizedString,
  value: z.number().int().default(0),
  suffix: z.string().max(8).optional().or(z.literal("")),
  order: z.number().int().default(0),
});
export const statUpdateSchema = statCreateSchema.partial();

export const fleetCreateSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "küçük harf, rakam ve tire"),
  name: localizedString,
  desc: localizedString.optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});
export const fleetUpdateSchema = fleetCreateSchema.partial();

export const pageCreateSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "küçük harf, rakam ve tire"),
  title: localizedString,
  body: localizedString,
  seoTitle: localizedString.optional(),
  seoDesc: localizedString.optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});
export const pageUpdateSchema = pageCreateSchema.partial();
