"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PackageSearch, Search, AlertCircle, CheckCircle2, Clock, Truck, Home } from "lucide-react";
import { formatPrice } from "@/data/products";
import styles from "./track-order.module.css";

const statusSteps = [
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "processing", label: "Tailoring & Packing", icon: Clock },
  { key: "shipped", label: "In Transit", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
];

export default function TrackOrderPage() {
  const [queryId, setQueryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const initialId = params.get("orderId");
      if (initialId) {
        setQueryId(initialId);
        track(initialId);
      }
    }
  }, []);

  const track = async (idToTrack: string) => {
    const cleanId = idToTrack.trim();
    if (!cleanId) {
      setError("Please enter a valid order number.");
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || "PA_live_key_web_client_2026_poonam_hash";
      const res = await fetch(`/api/orders/${cleanId}`, {
        headers: { "x-api-key": apiKey },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Order not found. Please verify the order ID.");
      }

      setOrder(data.order);
    } catch (err: any) {
      setError(err.message || "Failed to find order.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    track(queryId);
  };

  const getStepIndex = (status: string) => {
    const normalized = (status || "").toLowerCase();
    const idx = statusSteps.findIndex((s) => s.key === normalized);
    return idx >= 0 ? idx : 0;
  };

  return (
    <main className={`${styles.track} section`}>
      <section>
        <p className="eyebrow">Track order</p>
        <h1 className="title">Know exactly where your outfit is.</h1>
        <p className="copy">
          Enter your order ID (e.g. <code>PA-2026-1001</code>) to track your attire from boutique tailoring to delivery.
        </p>
      </section>

      <div style={{ display: "grid", gap: "2rem", maxWidth: "600px", width: "100%" }}>
        <form className={styles.card} onSubmit={handleSubmit}>
          <PackageSearch size={34} />
          <label>
            Order ID
            <span>
              <Search size={18} />
              <input
                placeholder="PA-2026-1001"
                value={queryId}
                onChange={(e) => setQueryId(e.target.value)}
                required
              />
            </span>
          </label>
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Tracking..." : "Track order"}
          </button>
          <Link className="buttonSecondary" href="/orders">
            View all my orders
          </Link>
        </form>

        {error && (
          <div style={{
            padding: "1rem",
            background: "#fff0f2",
            color: "#d32f2f",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {order && (
          <div style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid var(--line)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: "12px", marginBottom: "16px" }}>
              <div>
                <strong style={{ fontSize: "1.2rem", color: "#8B1E3F" }}>#{order.orderNumber}</strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>Recipient: {order.customerName}</p>
              </div>
              <span style={{
                background: "#e8f5e9",
                color: "#2e7d32",
                fontWeight: 700,
                fontSize: "0.85rem",
                padding: "4px 10px",
                borderRadius: "20px",
                textTransform: "capitalize"
              }}>
                {order.orderStatus}
              </span>
            </div>

            {/* Step Timeline */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", margin: "1.5rem 0", textAlign: "center" }}>
              {statusSteps.map((step, idx) => {
                const isPassed = idx <= getStepIndex(order.orderStatus);
                const Icon = step.icon;
                return (
                  <div key={step.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: isPassed ? "#8B1E3F" : "#eee",
                      color: isPassed ? "white" : "#999",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <Icon size={18} />
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: isPassed ? 700 : 400, color: isPassed ? "#333" : "#999" }}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ borderTop: "1px solid #eee", paddingTop: "12px", fontSize: "0.9rem" }}>
              <p><strong>Shipping to:</strong> {order.shippingAddress}, {order.city}, {order.state} - {order.postalCode}</p>
              <p><strong>Total Amount:</strong> {formatPrice(order.totalAmount)} ({order.paymentMethod.toUpperCase()})</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
