"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PackageSearch,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  Truck,
  Home,
  MapPin,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { formatPrice } from "@/data/products";
import { useAuthStore } from "@/store/useAuthStore";
import styles from "./track-order.module.css";

const statusSteps = [
  {
    key: "confirmed",
    label: "Confirmed",
    desc: "Order verified & tailoring scheduled",
    icon: CheckCircle2,
    time: "Day 1",
  },
  {
    key: "processing",
    label: "Tailoring & QC",
    desc: "Handcrafted embroidery, fitting & finish",
    icon: Clock,
    time: "Day 2",
  },
  {
    key: "shipped",
    label: "Dispatched",
    desc: "Out for delivery with Boutique Express Courier",
    icon: Truck,
    time: "Day 3",
  },
  {
    key: "delivered",
    label: "Delivered",
    desc: "Safely delivered to your address",
    icon: Home,
    time: "Day 4",
  },
];

export default function TrackOrderPage() {
  const customer = useAuthStore((state) => state.customer);
  const [queryId, setQueryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [showSearchBox, setShowSearchBox] = useState(false);

  // Automatically load customer's orders on mount
  useEffect(() => {
    const fetchLatestOrParam = async () => {
      let paramOrderId: string | null = null;
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        paramOrderId = params.get("orderId");
      }

      if (paramOrderId) {
        setQueryId(paramOrderId);
        track(paramOrderId);
        return;
      }

      // If no param, fetch user's recent orders and load the latest one automatically
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY || "PA_live_key_web_client_2026_poonam_hash";
        const headers: Record<string, string> = { "x-api-key": apiKey };
        if (customer?.token) {
          headers["Authorization"] = `Bearer ${customer.token}`;
        }

        const res = await fetch("/api/orders", { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
            setRecentOrders(data.orders);
            // Automatically track latest order so user DOES NOT NEED TO TYPE in a box!
            const latest = data.orders[0];
            setQueryId(latest.orderNumber || latest.order_number);
            track(latest.orderNumber || latest.order_number);
            return;
          }
        }
      } catch (e) {
        console.error("Failed to load user orders automatically:", e);
      }

      // If no orders found, show search box by default
      setShowSearchBox(true);
    };

    fetchLatestOrParam();
  }, [customer]);

  const track = async (idToTrack: string) => {
    const cleanId = idToTrack.trim();
    if (!cleanId) {
      setError("Please enter a valid order number.");
      return;
    }

    setLoading(true);
    setError(null);

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
      setShowSearchBox(false);
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
    const norm = (status || "").toLowerCase();
    const idx = statusSteps.findIndex((s) => s.key === norm);
    return idx >= 0 ? idx : 0;
  };

  const paymentMethodStr = (order?.paymentMethod || order?.payment_method || "COD").toUpperCase();

  return (
    <main className={`${styles.track} section`}>
      <section style={{ marginBottom: "1.5rem" }}>
        <p className="eyebrow">Real-Time Shipment Tracking</p>
        <h1 className="title">Know exactly where your outfit is.</h1>
        <p className="copy">
          Live fulfillment status, tailoring progress, and courier checkpoints for your Poonam Attire outfits.
        </p>

        {/* Quick order switcher buttons if user has multiple orders */}
        {recentOrders.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#666", marginRight: "10px" }}>
              Your Orders:
            </span>
            <div style={{ display: "inline-flex", gap: "8px", flexWrap: "wrap", marginTop: "6px" }}>
              {recentOrders.map((ro) => {
                const num = ro.orderNumber || ro.order_number;
                const isSelected = order?.orderNumber === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setQueryId(num);
                      track(num);
                    }}
                    style={{
                      background: isSelected ? "#8B1E3F" : "#fff",
                      color: isSelected ? "#fff" : "#8B1E3F",
                      border: "1px solid #8B1E3F",
                      borderRadius: "20px",
                      padding: "4px 12px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    #{num} ({ro.orderStatus})
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <div style={{ display: "grid", gap: "2rem", maxWidth: "860px", width: "100%" }}>
        {/* Optional Search / Switcher Box */}
        {showSearchBox ? (
          <form className={styles.card} onSubmit={handleSubmit}>
            <PackageSearch size={34} />
            <label>
              Order ID
              <span>
                <Search size={18} />
                <input
                  placeholder="e.g. PA-2026-4572"
                  value={queryId}
                  onChange={(e) => setQueryId(e.target.value)}
                  required
                />
              </span>
            </label>
            <button className="button" type="submit" disabled={loading}>
              {loading ? "Locating Order..." : "Track Order"}
            </button>
            <Link className="buttonSecondary" href="/orders">
              View all my orders
            </Link>
          </form>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => setShowSearchBox(true)}
              style={{
                background: "none",
                border: "none",
                color: "#8B1E3F",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Search size={15} /> Track a different order number
            </button>
            <Link className="buttonSecondary" href="/orders">
              Back to all orders
            </Link>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "1rem",
              background: "#fff0f2",
              color: "#d32f2f",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Live Order Detail & Tracking View */}
        {order && (
          <div
            style={{
              background: "white",
              padding: "28px",
              borderRadius: "16px",
              border: "1px solid var(--line)",
              boxShadow: "0 14px 40px rgba(139, 30, 63, 0.08)",
            }}
          >
            {/* Order Top Bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                borderBottom: "1px solid #eee",
                paddingBottom: "16px",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      color: "#8B1E3F",
                      fontSize: "1.6rem",
                    }}
                  >
                    #{order.orderNumber}
                  </h2>
                  <span
                    style={{
                      background:
                        order.orderStatus === "delivered"
                          ? "#e8f5e9"
                          : order.orderStatus === "shipped"
                          ? "#e3f2fd"
                          : "#fff3e0",
                      color:
                        order.orderStatus === "delivered"
                          ? "#2e7d32"
                          : order.orderStatus === "shipped"
                          ? "#1565c0"
                          : "#e65100",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      padding: "4px 12px",
                      borderRadius: "16px",
                      textTransform: "uppercase",
                    }}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <p style={{ margin: "4px 0 0", color: "#666", fontSize: "0.9rem" }}>
                  Recipient: <strong>{order.customerName}</strong> &bull; Contact: {order.customerPhone}
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <strong style={{ fontSize: "1.5rem", color: "#111" }}>
                  {formatPrice(order.totalAmount)}
                </strong>
                <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: "#777" }}>
                  Payment: <strong>{paymentMethodStr}</strong> ({order.paymentStatus || "pending"})
                </p>
              </div>
            </div>

            {/* Stepper Timeline with Icons */}
            <div style={{ background: "#fbf8f5", padding: "20px", borderRadius: "14px", margin: "1.5rem 0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                {statusSteps.map((step, idx) => {
                  const currentIdx = getStepIndex(order.orderStatus);
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.key}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "50%",
                          background: isDone ? "#8B1E3F" : "#e0e0e0",
                          color: isDone ? "white" : "#777",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: isCurrent ? "0 0 0 5px rgba(139, 30, 63, 0.25)" : "none",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <Icon size={20} />
                      </div>
                      <strong
                        style={{
                          fontSize: "0.88rem",
                          marginTop: "8px",
                          color: isDone ? "#8B1E3F" : "#777",
                        }}
                      >
                        {step.label}
                      </strong>
                      <span
                        style={{
                          fontSize: "0.74rem",
                          color: "#888",
                          marginTop: "3px",
                          lineHeight: 1.3,
                        }}
                      >
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ordered Dresses Gallery */}
            <div style={{ marginTop: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "12px", color: "#333" }}>
                Ordered Outfits ({order.items?.length || 0})
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "14px",
                }}
              >
                {order.items && order.items.length > 0 ? (
                  order.items.map((item: any, idx: number) => {
                    const fallbackImage =
                      "https://images.unsplash.com/photo-1594226801341-41427b4e5c22?auto=format&fit=crop&w=900&q=80";
                    const itemImg = item.imageUrl || item.image_url || item.image || fallbackImage;

                    return (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          gap: "12px",
                          background: "#fafafa",
                          border: "1px solid #eee",
                          borderRadius: "10px",
                          padding: "10px",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            width: "70px",
                            height: "90px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            flexShrink: 0,
                            background: "#eee",
                          }}
                        >
                          <Image
                            src={itemImg}
                            alt={item.productName || item.name || "Attire"}
                            fill
                            sizes="70px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <strong
                            style={{
                              display: "block",
                              fontSize: "0.92rem",
                              color: "#222",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={item.productName || item.name}
                          >
                            {item.productName || item.name}
                          </strong>
                          <div style={{ display: "flex", gap: "6px", margin: "4px 0" }}>
                            <span
                              style={{
                                fontSize: "0.75rem",
                                background: "#e8eaf6",
                                color: "#283593",
                                padding: "2px 7px",
                                borderRadius: "4px",
                                fontWeight: 600,
                              }}
                            >
                              Size: {item.size}
                            </span>
                            <span
                              style={{
                                fontSize: "0.75rem",
                                background: "#f0f0f0",
                                color: "#555",
                                padding: "2px 7px",
                                borderRadius: "4px",
                                fontWeight: 600,
                              }}
                            >
                              Qty: {item.quantity}
                            </span>
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "#8B1E3F", fontWeight: 700 }}>
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: "#777", fontSize: "0.9rem" }}>No item details found.</p>
                )}
              </div>
            </div>

            {/* Delivery & Shipping Info */}
            <div
              style={{
                borderTop: "1px solid #eee",
                paddingTop: "16px",
                marginTop: "20px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                fontSize: "0.9rem",
              }}
            >
              <div>
                <p style={{ fontWeight: 700, margin: "0 0 4px", color: "#444" }}>SHIPPING DESTINATION</p>
                <p style={{ margin: 0, color: "#666" }}>
                  {order.shippingAddress}, {order.city}, {order.state} - {order.postalCode}
                </p>
              </div>
              <div>
                <p style={{ fontWeight: 700, margin: "0 0 4px", color: "#444" }}>SPECIAL INSTRUCTIONS</p>
                <p style={{ margin: 0, color: "#666" }}>
                  {order.notes || "Standard boutique express delivery"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
