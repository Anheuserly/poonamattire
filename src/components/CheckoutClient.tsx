"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, CheckCircle2, AlertCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useCommerceStore, getCartSubtotal } from "@/store/useCommerceStore";
import { useUiStore } from "@/store/useUiStore";
import { formatPrice } from "@/data/products";
import styles from "./CheckoutClient.module.css";

export function CheckoutClient() {
  const router = useRouter();
  const customer = useAuthStore((state) => state.customer);
  const openAuthModal = useUiStore((state) => state.openAuthModal);
  const cart = useCommerceStore((state) => state.cart);
  const clearCart = useCommerceStore((state) => state.clearCart);

  const [fullName, setFullName] = useState(customer?.fullName || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [state, setState] = useState("Maharashtra");
  const [postalCode, setPostalCode] = useState("400001");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  const subtotal = getCartSubtotal(cart);

  if (!customer) {
    return (
      <main className={`${styles.locked} section`}>
        <div>
          <p className="eyebrow">Checkout</p>
          <h1 className="title">Login or register before placing an order.</h1>
          <p className="copy">
            This keeps delivery details, order tracking, returns, and support
            connected to the right customer account.
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

  if (completedOrder) {
    return (
      <main className={`${styles.locked} section`}>
        <div>
          <p className="eyebrow">Order Placed</p>
          <h1 className="title">Thank you for your order!</h1>
          <p className="copy">
            Your ethnic wear order has been recorded and is being prepared.
          </p>
        </div>
        <section className={styles.lockCard} style={{ textAlign: "center" }}>
          <CheckCircle2 size={48} color="#2e7d32" style={{ margin: "0 auto" }} />
          <h2>Order #{completedOrder.orderNumber}</h2>
          <p>
            Total: <strong>{formatPrice(completedOrder.totalAmount)}</strong>
          </p>
          <p>A confirmation email and SMS will be sent to {customer.email}.</p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", justifyContent: "center" }}>
            <Link className="button" href={`/track-order?orderId=${completedOrder.orderNumber}`}>
              Track Order
            </Link>
            <Link className="buttonSecondary" href="/orders">
              View All Orders
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className={`${styles.locked} section`}>
        <div>
          <p className="eyebrow">Your Bag is Empty</p>
          <h1 className="title">Add dress collections to proceed.</h1>
        </div>
        <section className={styles.lockCard}>
          <ShoppingBag size={34} />
          <h2>No items in your cart</h2>
          <p>Browse our festive suits, kurtas, and luxury ensembles.</p>
          <Link className="button" href="/shop">
            Shop Collections
          </Link>
        </section>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const items = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        size: item.size,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.image,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "PA_live_key_web_client_2026_poonam_hash",
          ...(customer.token ? { Authorization: `Bearer ${customer.token}` } : {}),
        },
        body: JSON.stringify({
          customerName: fullName || customer.fullName,
          customerEmail: customer.email,
          customerPhone: phone || customer.phone,
          shippingAddress: address,
          city,
          state,
          postalCode,
          paymentMethod,
          notes,
          items,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to place order.");
      }

      clearCart();
      setCompletedOrder(data.order);
    } catch (err: any) {
      setError(err.message || "Failed to submit order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

      {error && (
        <div style={{
          padding: "1rem",
          background: "#fff0f2",
          color: "#d32f2f",
          borderRadius: "8px",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Full name
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={customer.fullName}
            required
          />
        </label>
        <label>
          Mobile / WhatsApp number
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={customer.phone}
            required
          />
        </label>
        <label>
          Street address & Flat No.
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Flat 402, Royal Palms, Linking Road"
            required
          />
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
          <label>
            City
            <input value={city} onChange={(e) => setCity(e.target.value)} required />
          </label>
          <label>
            State
            <input value={state} onChange={(e) => setState(e.target.value)} required />
          </label>
          <label>
            PIN code
            <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
          </label>
        </div>
        <label>
          Delivery Notes / Tailoring instructions (optional)
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Please call before delivery"
          />
        </label>

        <div style={{ marginTop: "1rem" }}>
          <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Payment method</p>
          <div className={styles.payments}>
            <button
              type="button"
              style={{
                background: paymentMethod === "cod" ? "#8B1E3F" : "#fff",
                color: paymentMethod === "cod" ? "#fff" : "#333",
                borderColor: paymentMethod === "cod" ? "#8B1E3F" : "#ddd",
              }}
              onClick={() => setPaymentMethod("cod")}
            >
              Cash on delivery
            </button>
            <button
              type="button"
              style={{
                background: paymentMethod === "upi" ? "#8B1E3F" : "#fff",
                color: paymentMethod === "upi" ? "#fff" : "#333",
                borderColor: paymentMethod === "upi" ? "#8B1E3F" : "#ddd",
              }}
              onClick={() => setPaymentMethod("upi")}
            >
              UPI / QR
            </button>
            <button
              type="button"
              style={{
                background: paymentMethod === "card" ? "#8B1E3F" : "#fff",
                color: paymentMethod === "card" ? "#fff" : "#333",
                borderColor: paymentMethod === "card" ? "#8B1E3F" : "#ddd",
              }}
              onClick={() => setPaymentMethod("card")}
            >
              Card
            </button>
          </div>
        </div>

        <div style={{ padding: "1rem", background: "#fbf8f5", borderRadius: "8px", margin: "1rem 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span>Subtotal ({cart.length} items):</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", color: "#2e7d32" }}>
            <span>Shipping:</span>
            <span>FREE</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", borderTop: "1px solid #ddd", paddingTop: "0.5rem" }}>
            <span>Total Payable:</span>
            <strong style={{ color: "#8B1E3F" }}>{formatPrice(subtotal)}</strong>
          </div>
        </div>

        <button className="button" type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? "Placing order..." : `Place order (${formatPrice(subtotal)})`}
        </button>
      </form>
    </main>
  );
}
