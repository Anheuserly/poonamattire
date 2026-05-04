"use client";

import { ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUiStore } from "@/store/useUiStore";
import styles from "./CheckoutClient.module.css";

export function CheckoutClient() {
  const customer = useAuthStore((state) => state.customer);
  const openAuthModal = useUiStore((state) => state.openAuthModal);

  if (!customer) {
    return (
      <main className={`${styles.locked} section`}>
        <div>
          <p className="eyebrow">Checkout</p>
          <h1 className="title">Login or register before placing an order.</h1>
          <p className="copy">
            This keeps delivery details, order tracking, returns, and support
            connected to the right customer.
          </p>
        </div>
        <section className={styles.lockCard}>
          <ShieldCheck size={34} />
          <h2>Secure customer checkout</h2>
          <p>Continue with your account to confirm address and payment details.</p>
          <button className="button" onClick={() => openAuthModal("login")}>
            Login
          </button>
          <button className="buttonSecondary" onClick={() => openAuthModal("register")}>
            Register
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={`${styles.checkout} section`}>
      <div>
        <p className="eyebrow">Checkout</p>
        <h1 className="title">Secure checkout for your order.</h1>
        <p className="copy">
          Confirm your delivery details, select a payment method, and place the
          order under your account.
        </p>
      </div>
      <form className={styles.form}>
        <label>
          Full name
          <input placeholder={customer.name} />
        </label>
        <label>
          Mobile number
          <input placeholder="+91 98765 43210" />
        </label>
        <label>
          Delivery address
          <textarea placeholder="House, street, area, city, pincode" />
        </label>
        <div className={styles.payments}>
          <button type="button">Razorpay</button>
          <button type="button">Cash on delivery</button>
          <button type="button">Card</button>
        </div>
        <button className="button" type="button">
          Place order
        </button>
      </form>
    </main>
  );
}
