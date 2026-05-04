"use client";

import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUiStore } from "@/store/useUiStore";
import styles from "./CheckoutGate.module.css";

export function CheckoutGate() {
  const customer = useAuthStore((state) => state.customer);
  const openAuthModal = useUiStore((state) => state.openAuthModal);

  if (customer) {
    return (
      <Link className="button" href="/checkout">
        Checkout securely
      </Link>
    );
  }

  return (
    <div className={styles.gate}>
      <p>
        <LockKeyhole size={16} /> Login or register to place this order.
      </p>
      <button className="button" onClick={() => openAuthModal("login")}>
        Login to checkout
      </button>
      <button className="buttonSecondary" onClick={() => openAuthModal("register")}>
        Create account
      </button>
    </div>
  );
}
