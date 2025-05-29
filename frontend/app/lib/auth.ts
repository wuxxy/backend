import { create } from "zustand";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import api from "./api";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: { access_key: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/login", credentials);
      set({ user: res.data, loading: false });
    } catch (err: any) {
      console.log(err);
      set({
        error: err?.response?.data?.message || "Login failed",
        loading: false,
      });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error(err);
    }
    set({ user: null });
  },

  refresh: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/auth/me", { withCredentials: true });
      set({ user: res.data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
}));

export function useAuthRedirect(requireLogin: boolean) {
  const { user, loading, refresh } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const runRefresh = async () => {
      await refresh();
    };

    runRefresh();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    if (requireLogin && !user) {
      navigate("/login", { replace: true });
    }

    if (!requireLogin && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, requireLogin, navigate]);
}