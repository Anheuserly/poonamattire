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
  addToCart: (product: Product, size?: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  removeFromCart: (id: string, size: string) => void;
  toggleWishlist: (id: string) => void;
  addRecentlyViewed: (product: Product) => void;
  applyCoupon: (coupon: string) => void;
};

export const useCommerceStore = create<CommerceState>((set) => ({
  cart: [],
  wishlist: [],
  recentlyViewed: [],
  coupon: "",
  addToCart: (product, size = product.sizes[0]) =>
    set((state) => {
      const existing = state.cart.find(
        (item) => item.product.id === product.id && item.size === size,
      );

      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id && item.size === size
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }

      return { cart: [...state.cart, { product, size, quantity: 1 }] };
    }),
  updateQuantity: (id, size, quantity) =>
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.product.id === id && item.size === size
            ? { ...item, quantity }
            : item,
        )
        .filter((item) => item.quantity > 0),
    })),
  removeFromCart: (id, size) =>
    set((state) => ({
      cart: state.cart.filter(
        (item) => item.product.id !== id || item.size !== size,
      ),
    })),
  toggleWishlist: (id) =>
    set((state) => ({
      wishlist: state.wishlist.includes(id)
        ? state.wishlist.filter((item) => item !== id)
        : [...state.wishlist, id],
    })),
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
