// Haber/blog tek kaynak. Tarih sabit; metinler çeviriden (news.posts.<slug>.{title,excerpt,body}).
export type Post = {
  slug: string;
  date: string; // ISO
};

export const posts: Post[] = [
  { slug: "suriye-hatti-yeniden", date: "2026-05-20" },
  { slug: "filo-yenileme", date: "2026-04-08" },
  { slug: "gumruk-surec-hizlandi", date: "2026-02-15" },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const postSlugs = posts.map((p) => p.slug);
