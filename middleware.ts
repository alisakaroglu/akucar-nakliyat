import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Tüm yollar, /api, statik dosyalar ve _next hariç.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
