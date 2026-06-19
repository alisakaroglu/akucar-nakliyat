import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Tüm yollar; /api, /admin (kendi auth'u var), statik dosyalar ve _next hariç.
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
