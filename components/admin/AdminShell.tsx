"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import {
  LayoutDashboard, Truck, Newspaper, FileText, Inbox,
  Mail, Users, Settings, LogOut, Loader2, Building2, HelpCircle,
  Images, BarChart3, UserPlus, Route as RouteIcon, Home,
} from "lucide-react";
import { useAuth } from "./AuthProvider";

const nav = [
  { href: "/admin", label: "Genel Bakış", Icon: LayoutDashboard, exact: true },
  { href: "/admin/home", label: "Anasayfa Tanıtım", Icon: Home },
  { href: "/admin/services", label: "Hizmetler", Icon: Truck },
  { href: "/admin/fleet", label: "Filo", Icon: Truck },
  { href: "/admin/routes", label: "Güzergahlar", Icon: RouteIcon },
  { href: "/admin/news", label: "Haberler", Icon: Newspaper },
  { href: "/admin/hero", label: "Hero Slaytları", Icon: Images },
  { href: "/admin/stats", label: "İstatistikler", Icon: BarChart3 },
  { href: "/admin/references", label: "Referanslar", Icon: Building2 },
  { href: "/admin/team", label: "Ekip", Icon: Users },
  { href: "/admin/faq", label: "SSS", Icon: HelpCircle },
  { href: "/admin/pages", label: "Sayfalar", Icon: FileText },
  { href: "/admin/quotes", label: "Teklif Talepleri", Icon: Inbox },
  { href: "/admin/messages", label: "Mesajlar", Icon: Mail },
  { href: "/admin/subscribers", label: "Aboneler", Icon: UserPlus },
  { href: "/admin/settings", label: "Ayarlar", Icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  const isLogin = pathname === "/admin/login";

  // Giriş yoksa login'e yönlendir (login sayfası hariç).
  useEffect(() => {
    if (ready && !user && !isLogin) router.replace("/admin/login");
  }, [ready, user, isLogin, router]);

  // Login ekranı: chrome yok, ortalanmış.
  if (isLogin) return <>{children}</>;

  // Oturum doğrulanana kadar yükleniyor.
  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-accent" />
      </div>
    );
  }

  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-e border-border-subtle bg-elevated md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border-subtle px-6">
          <span className="font-display text-h4 font-semibold">
            AKUÇAR<span className="text-accent">.</span>
          </span>
          <span className="ms-1 rounded bg-accent-soft px-2 py-0.5 text-overline uppercase text-accent">
            Panel
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {nav.map(({ href, label, Icon, exact }) => {
            const on = active(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-body transition",
                  on
                    ? "bg-accent-soft text-accent"
                    : "text-text-muted hover:bg-overlay hover:text-text-primary",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border-subtle p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-body text-text-muted transition hover:bg-overlay hover:text-danger"
          >
            <LogOut className="h-5 w-5" />
            Çıkış yap
          </button>
        </div>
      </aside>

      {/* İçerik */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border-subtle bg-base/80 px-6 backdrop-blur-md">
          <div className="font-display text-h4 font-medium">
            {nav.find((n) => active(n.href, n.exact))?.label ?? "Panel"}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-end">
              <div className="text-small text-text-primary">{user.name ?? "Admin"}</div>
              <div className="text-overline uppercase text-text-faint">{user.email}</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft font-display text-accent">
              {(user.name ?? user.email).charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
