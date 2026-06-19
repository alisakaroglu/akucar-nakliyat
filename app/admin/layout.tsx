import type { Metadata } from "next";
import { fontSans, fontDisplay } from "../fonts";
import { AdminProviders } from "@/components/admin/Providers";
import { AdminShell } from "@/components/admin/AdminShell";
import "../globals.css";

export const metadata: Metadata = {
  title: "Akuçar Panel",
  robots: { index: false, follow: false },
};

// Admin alanı kendi html kökü (site [locale] layout'undan bağımsız, çok dilsiz).
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${fontSans.variable} ${fontDisplay.variable}`}>
      <body className="bg-base font-sans text-text-primary antialiased">
        <AdminProviders>
          <AdminShell>{children}</AdminShell>
        </AdminProviders>
      </body>
    </html>
  );
}
