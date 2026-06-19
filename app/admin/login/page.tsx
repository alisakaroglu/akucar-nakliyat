"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "@/components/admin/AuthProvider";
import { images } from "@/lib/images";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, ready, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Zaten girişliyse panele al.
  useEffect(() => {
    if (ready && user) router.replace("/admin");
  }, [ready, user, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  }

  const input =
    "h-12 w-full rounded-md border border-border-subtle bg-overlay px-4 text-body text-text-primary placeholder:text-text-faint focus:border-accent focus:outline-none";

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Sol: sinematik marka paneli */}
      <div className="relative hidden overflow-hidden lg:block">
        <Image src={images.hero} alt="" fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-base/70" />
        <div className="absolute inset-0 bg-amber-glow opacity-40" />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <span className="font-display text-h3 font-semibold">
            AKUÇAR<span className="text-accent">.</span>
          </span>
          <div>
            <span className="overline">YÖNETİM PANELİ</span>
            <h1 className="mt-3 max-w-md font-display text-h1 font-semibold leading-tight">
              İçeriğinizi tek yerden, zahmetsizce yönetin.
            </h1>
            <p className="mt-4 max-w-md text-body text-text-muted">
              Hizmetler, haberler, teklif talepleri ve daha fazlası — kod bilmeden.
            </p>
          </div>
        </div>
      </div>

      {/* Sağ: giriş formu */}
      <div className="flex items-center justify-center bg-base p-8">
        <div className="w-full max-w-sm">
          <div className="mb-2 flex items-center gap-2 lg:hidden">
            <span className="font-display text-h3 font-semibold">
              AKUÇAR<span className="text-accent">.</span>
            </span>
          </div>
          <div className="mb-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-accent-soft">
              <Lock className="h-6 w-6 text-accent" />
            </div>
            <h2 className="font-display text-h2 font-semibold">Giriş yap</h2>
            <p className="mt-2 text-body text-text-muted">
              Panele erişmek için bilgilerinizi girin.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-small text-text-muted" htmlFor="email">
                E-posta
              </label>
              <input
                id="email" type="email" required autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className={input} placeholder="admin@akucarnakliyat.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-small text-text-muted" htmlFor="password">
                Parola
              </label>
              <input
                id="password" type="password" required autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className={input} placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-small text-danger">
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-accent font-medium text-base transition hover:bg-accent-light disabled:opacity-60"
            >
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              {loading ? "Giriş yapılıyor…" : "Giriş yap"}
            </button>
          </form>

          <p className="mt-8 text-center text-small text-text-faint">
            © {new Date().getFullYear()} Akuçar Nakliyat
          </p>
        </div>
      </div>
    </div>
  );
}
