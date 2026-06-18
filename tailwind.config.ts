import type { Config } from "tailwindcss";

// Token kaynağı: docs/design-system.md §8. Tek noktadan beslenir (DRY).
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0A0E14",
        elevated: "#11161F",
        overlay: "#1A212D",
        border: { subtle: "#232C3A" },
        text: { primary: "#F5F3EF", muted: "#A8AEB8", faint: "#6B7280" },
        accent: {
          DEFAULT: "#D4A24E",
          light: "#E8B45A",
          dark: "#A87C34",
          soft: "rgba(212,162,78,0.12)",
        },
        success: "#4E9D6B",
        warning: "#D9A441",
        danger: "#C5564B",
        info: "#5B8AA6",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "Tahoma", "sans-serif"],
      },
      fontSize: {
        overline: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.12em" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
        body: ["1rem", { lineHeight: "1.65" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        h4: ["1.333rem", { lineHeight: "1.3" }],
        h3: ["1.777rem", { lineHeight: "1.2" }],
        h2: ["2.369rem", { lineHeight: "1.15" }],
        h1: ["3.157rem", { lineHeight: "1.1" }],
        display: ["4.209rem", { lineHeight: "1.05" }],
      },
      spacing: { 18: "4.5rem", 30: "7.5rem", 40: "10rem" },
      borderRadius: { sm: "6px", md: "12px", lg: "20px", xl: "28px" },
      boxShadow: {
        card: "0 8px 30px rgba(0,0,0,0.35)",
        amber: "0 6px 24px rgba(212,162,78,0.25)",
      },
      maxWidth: { container: "1280px", prose: "70ch" },
      backgroundImage: {
        "hero-fade":
          "linear-gradient(180deg, rgba(10,14,20,0) 0%, #0A0E14 90%)",
        "amber-glow":
          "radial-gradient(circle, rgba(232,180,90,0.18), transparent 70%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
