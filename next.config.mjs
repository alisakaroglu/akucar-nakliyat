import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Geçici placeholder kaynağı (telifsiz, Pexels lisansı). Final: gerçek filo fotoğrafları (v3).
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Cloudinary/UploadThing (v2)
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
