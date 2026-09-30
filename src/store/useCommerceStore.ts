"use client";

import { create } from "zustand";
import type { Product } from "@/data/products";

export type CartItem = {
  product: Product;
  size: string;
  quantity: number;
};

type CommerceState = {
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: Product[];
  coupon: string;
  initCommerce: () => void;
  addToCart: (product: Product, size?: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  removeFromCart: (id: string, size: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  addRecentlyViewed: (product: Product) => void;
  applyCoupon: (coupon: string) => void;
};

export const useCommerceStore = create<CommerceState>((set, get) => ({
  cart: [],
  wishlist: [],
  recentlyViewed: [],
  coupon: "",

  initCommerce: () => {
    if (typeof window === "undefined") return;
    try {
      const storedCart = localStorage.getItem("poonam_cart");
      if (storedCart) {
        set({ cart: JSON.parse(storedCart) });
      }
      const storedWishlist = localStorage.getItem("poonam_wishlist");
      if (storedWishlist) {
        set({ wishlist: JSON.parse(storedWishlist) });
      }
    } catch (e) {
      console.error("Failed to load commerce store from storage", e);
    }
  },

  addToCart: (product, size = product.sizes[0]) =>
    set((state) => {
      const existing = state.cart.find(
        (item) => item.product.id === product.id && item.size === size,
      );

      let newCart: CartItem[];
      if (existing) {
        newCart = state.cart.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        newCart = [...state.cart, { product, size, quantity: 1 }];
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("poonam_cart", JSON.stringify(newCart));
      }

      return { cart: newCart };
    }),

  updateQuantity: (id, size, quantity) =>
    set((state) => {
      const newCart = state.cart
        .map((item) =>
          item.product.id === id && item.size === size
            ? { ...item, quantity }
            : item,
        )
        .filter((item) => item.quantity > 0);

      if (typeof window !== "undefined") {
        localStorage.setItem("poonam_cart", JSON.stringify(newCart));
      }

      return { cart: newCart };
    }),

  removeFromCart: (id, size) =>
    set((state) => {
      const newCart = state.cart.filter(
        (item) => item.product.id !== id || item.size !== size,
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("poonam_cart", JSON.stringify(newCart));
      }

      return { cart: newCart };
    }),

  clearCart: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("poonam_cart");
    }
    set({ cart: [] });
  },

  toggleWishlist: (id) =>
    set((state) => {
      const newWishlist = state.wishlist.includes(id)
        ? state.wishlist.filter((item) => item !== id)
        : [...state.wishlist, id];

      if (typeof window !== "undefined") {
        localStorage.setItem("poonam_wishlist", JSON.stringify(newWishlist));
      }

      return { wishlist: newWishlist };
    }),

  addRecentlyViewed: (product) =>
    set((state) => ({
      recentlyViewed: [
        product,
        ...state.recentlyViewed.filter((item) => item.id !== product.id),
      ].slice(0, 4),
    })),

  applyCoupon: (coupon) => set({ coupon: coupon.trim().toUpperCase() }),
}));

export function getCartSubtotal(cart: CartItem[]) {
  return cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
}
