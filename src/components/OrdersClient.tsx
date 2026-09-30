"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PackageCheck, RefreshCw, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/data/products";
import { useAuthStore } from "@/store/useAuthStore";
import styles from "@/app/orders/orders.module.css";

const orderSteps = ["confirmed", "processing", "shipped", "delivered"];

export function OrdersClient() {
  const customer = useAuthStore((state) => state.customer);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || "PA_live_key_web_client_2026_poonam_hash";
      const headers: Record<string, string> = { "x-api-key": apiKey };
      if (customer?.token) {
        headers["Authorization"] = `Bearer ${customer.token}`;
      }

      const res = await fetch("/api/orders", { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      }
    } catch (e) {
      console.error("Failed to fetch orders:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [customer]);

  const getStepIndex = (status: string) => {
    const idx = orderSteps.indexOf(status?.toLowerCase());
    return idx >= 0 ? idx + 1 : 1;
  };

  return (
    <main className={`${styles.orders} section`}>
      <div className="sectionHeader">
        <div>
          <p className="eyebrow">Orders</p>
          <h1 className="title">Manage every boutique order.</h1>
          {customer && (
            <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "4px" }}>
              Viewing orders for {customer.fullName} ({customer.email})
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className="buttonSecondary"
            onClick={fetchOrders}
            disabled={loading}
            style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
          >
            <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh
          </button>
          <Link className="buttonSecondary" href="/track-order">
            Track by ID
          </Link>
        </div>
      </div>

      {orders.length === 0 && !loading ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "white", borderRadius: "12px", border: "1px solid var(--line)" }}>
          <ShoppingBag size={40} color="#8B1E3F" style={{ margin: "0 auto 1rem" }} />
          <h3>No orders yet</h3>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>Explore our ethnic suits, lehengas, and dresses.</p>
          <Link className="button" href="/shop">
            Shop Collections
          </Link>
        </div>
      ) : (
        <div className={styles.list}>
          {orders.map((order) => {
            const stepNum = getStepIndex(order.orderStatus);
            const itemsSummary =
              order.items && order.items.length > 0
                ? order.items.map((i: any) => `${i.productName} (${i.size}) × ${i.quantity}`).join(", ")
                : "Designer Attire Ensemble";

            return (
              <article key={order.id}>
                <div className={styles.top}>
                  <PackageCheck />
                  <div>
                    <h2>#{order.orderNumber}</h2>
                    <p>{itemsSummary}</p>
                    <span style={{ fontSize: "0.8rem", color: "#888" }}>
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <strong>{formatPrice(order.totalAmount)}</strong>
                </div>
                <div className={styles.timeline}>
                  {orderSteps.map((step, index) => (
                    <span className={index < stepNum ? styles.done : ""} key={step} style={{ textTransform: "capitalize" }}>
                      {step}
                    </span>
                  ))}
                </div>
                <footer>
                  <span style={{ textTransform: "capitalize", fontWeight: 600 }}>Status: {order.orderStatus}</span>
                  <span style={{ color: "#666" }}>Delivery: {order.city}, {order.state}</span>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
