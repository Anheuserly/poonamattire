"use client";

import { create } from "zustand";

export type Customer = {
  id: string;
  email: string;
  fullName: string;
  name?: string;
  phone: string;
  role: "customer" | "staff" | "admin";
  token?: string;
};

type AuthState = {
  customer: Customer | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  initAuth: () => void;
};

const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "PA_live_key_web_client_2026_poonam_hash";

export const useAuthStore = create<AuthState>((set) => ({
  customer: null,
  isLoading: false,
  error: null,

  initAuth: () => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("poonam_customer_session");
      if (stored) {
        const customer = JSON.parse(stored);
        set({ customer });
      }
    } catch (e) {
      console.error("Failed to load customer session from storage", e);
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const errMsg = data.error || "Login failed. Please check your credentials.";
        set({ isLoading: false, error: errMsg });
        return { success: false, error: errMsg };
      }

      const customer: Customer = {
        ...data.user,
        token: data.token,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("poonam_customer_session", JSON.stringify(customer));
      }

      set({ customer, isLoading: false, error: null });
      return { success: true };
    } catch (err: any) {
      const errMsg = err.message || "Network error. Please try again.";
      set({ isLoading: false, error: errMsg });
      return { success: false, error: errMsg };
    }
  },

  register: async (email, password, fullName, phone) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({ email, password, fullName, phone }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const errMsg = data.error || "Registration failed. Please try again.";
        set({ isLoading: false, error: errMsg });
        return { success: false, error: errMsg };
      }

      const customer: Customer = {
        ...data.user,
        token: data.token,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("poonam_customer_session", JSON.stringify(customer));
      }

      set({ customer, isLoading: false, error: null });
      return { success: true };
    } catch (err: any) {
      const errMsg = err.message || "Network error. Please try again.";
      set({ isLoading: false, error: errMsg });
      return { success: false, error: errMsg };
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("poonam_customer_session");
    }
    set({ customer: null, error: null });
  },
}));
