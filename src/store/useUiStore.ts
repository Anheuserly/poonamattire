"use client";

import { create } from "zustand";
import type { Product } from "@/data/products";

type Toast = {
  product: Product;
  size?: string;
};

type UiState = {
  authModalOpen: boolean;
  authMode: "login" | "register";
  cartToast: Toast | null;
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
  showCartToast: (toast: Toast) => void;
  clearCartToast: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  authModalOpen: false,
  authMode: "login",
  cartToast: null,
  openAuthModal: (mode = "login") => set({ authModalOpen: true, authMode: mode }),
  closeAuthModal: () => set({ authModalOpen: false }),
  showCartToast: (toast) => set({ cartToast: toast }),
  clearCartToast: () => set({ cartToast: null }),
}));
