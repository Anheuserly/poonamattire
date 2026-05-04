"use client";

import { create } from "zustand";

type Customer = {
  name: string;
  email: string;
};

type AuthState = {
  customer: Customer | null;
  login: (customer?: Customer) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  customer: null,
  login: (customer = { name: "Poonam Customer", email: "customer@example.com" }) =>
    set({ customer }),
  logout: () => set({ customer: null }),
}));
