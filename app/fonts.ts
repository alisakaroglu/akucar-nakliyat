import {
  Inter,
  Space_Grotesk,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";

// Gövde / UI
export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Display / başlık.
// NOT: Tasarım sistemi Clash Display / General Sans öngörüyor (Google Fonts'ta yok).
// Lisanslı font dosyaları gelince next/font/local ile değiştirilecek; şimdilik
// karakterli bir Google alternatifi (Space Grotesk) stand-in olarak kullanılıyor.
export const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

// Arapça (RTL)
export const fontArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["400", "500", "600"],
});
