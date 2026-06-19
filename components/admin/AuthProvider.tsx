"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch, setToken, clearToken, getToken } from "@/lib/admin/api";

type AdminUser = { id: string; email: string; name: string | null; role: string };
type AuthCtx = {
  user: AdminUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      setReady(true);
      return;
    }
    apiFetch<{ user: AdminUser }>("/api/admin/me")
      .then((d) => setUser(d.user))
      .catch(() => clearToken())
      .finally(() => setReady(true));
  }, []);

  async function login(email: string, password: string) {
    const data = await apiFetch<{ token: string; user: AdminUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    clearToken();
    setUser(null);
    location.href = "/admin/login";
  }

  return <Ctx.Provider value={{ user, ready, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth AuthProvider içinde kullanılmalı");
  return c;
}
