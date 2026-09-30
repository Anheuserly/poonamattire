"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PackageCheck,
  RefreshCw,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";
import { formatPrice } from "@/data/products";
import { useAuthStore } from "@/store/useAuthStore";
import styles from "@/app/orders/orders.module.css";

const statusSteps = [
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2, desc: "Order verified & tailoring scheduled" },
  { key: "processing", label: "Tailoring & QC", icon: Clock, desc: "Handcrafting, stitching & quality check" },
  { key: "shipped", label: "Dispatched", icon: Truck, desc: "Handed over to boutique express courier" },
  { key: "delivered", label: "Delivered", icon: Home, desc: "Successfully delivered to your doorstep" },
];

export function OrdersClient() {
  const customer = useAuthStore((state) => state.customer);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

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
          // By default expand the first order
          if (data.orders.length > 0) {
            setExpandedOrders((prev) => ({
              ...prev,
              [data.orders[0].id || data.orders[0].orderNumber]: true,
            }));
          }
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

  const toggleExpand = (id: string) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getStepIndex = (status: string) => {
    const norm = (status || "").toLowerCase();
    const idx = statusSteps.findIndex((s) => s.key === norm);
    return idx >= 0 ? idx : 0;
  };

  return (
    <main className={`${styles.orders} section`}>
      <div className="sectionHeader">
        <div>
          <p className="eyebrow">Customer Orders & Tracking</p>
          <h1 className="title">Manage every boutique order.</h1>
          {customer && (
            <p style={{ color: "#666", fontSize: "0.95rem", marginTop: "6px" }}>
              Viewing orders for <strong>{customer.fullName}</strong> ({customer.email})
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            className="buttonSecondary"
            onClick={fetchOrders}
            disabled={loading}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <RefreshCw size={15} className={loading ? "spin" : ""} /> Refresh
          </button>
          <Link className="button" href="/shop">
            Shop More Looks
          </Link>
        </div>
      </div>

      {orders.length === 0 && !loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "3.5rem 1.5rem",
            background: "white",
            borderRadius: "16px",
            border: "1px solid var(--line)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
          }}
        >
          <ShoppingBag size={48} color="#8B1E3F" style={{ margin: "0 auto 1rem" }} />
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", marginBottom: "0.5rem" }}>
            No Orders Yet
          </h2>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>
            Your bag is waiting. Discover our handcrafted festive suits, Chanderi kurtas, and luxury ensembles.
          </p>
          <Link className="button" href="/shop">
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className={styles.list}>
          {orders.map((order) => {
            const orderKey = order.id || order.orderNumber;
            const currentStep = getStepIndex(order.orderStatus);
            const isExpanded = expandedOrders[orderKey] ?? true;
            const totalItemsCount = (order.items || []).reduce(
              (acc: number, item: any) => acc + (Number(item.quantity) || 1),
              0
            );

            return (
              <article
                key={orderKey}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  border: "1px solid var(--line)",
                  boxShadow: "0 12px 35px rgba(139, 30, 63, 0.06)",
                  overflow: "hidden",
                  padding: "24px",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Header Row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "1rem",
                    borderBottom: "1px solid var(--line)",
                    paddingBottom: "18px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "#fff0f2",
                        color: "#8B1E3F",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PackageCheck size={26} />
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <h2
                          style={{
                            margin: 0,
                            fontFamily: "var(--font-playfair), Georgia, serif",
                            fontSize: "1.4rem",
                            color: "#8B1E3F",
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
                            fontSize: "0.75rem",
                            padding: "3px 10px",
                            borderRadius: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                      <p style={{ margin: "4px 0 0", color: "#777", fontSize: "0.85rem" }}>
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        &bull; {totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"}
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <strong style={{ fontSize: "1.5rem", color: "#111" }}>
                      {formatPrice(order.totalAmount)}
                    </strong>
                    <span style={{ fontSize: "0.8rem", color: "#666", marginTop: "2px" }}>
                      Payment: <strong>{(order.paymentMethod || "cod").toUpperCase()}</strong> (
                      {order.paymentStatus || "pending"})
                    </span>
                  </div>
                </div>

                {/* Live Status Tracker Stepper */}
                <div style={{ margin: "22px 0", background: "#fbf8f5", padding: "18px 20px", borderRadius: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#8B1E3F" }}>
                      Live Shipment Tracker
                    </span>
                    <Link
                      href={`/track-order?orderId=${order.orderNumber}`}
                      style={{
                        fontSize: "0.85rem",
                        color: "#8B1E3F",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      Full Details <ExternalLink size={13} />
                    </Link>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "10px",
                    }}
                  >
                    {statusSteps.map((step, idx) => {
                      const isComplete = idx <= currentStep;
                      const isCurrent = idx === currentStep;
                      const Icon = step.icon;

                      return (
                        <div
                          key={step.key}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "50%",
                              background: isComplete ? "#8B1E3F" : "#e0e0e0",
                              color: isComplete ? "white" : "#777",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: isCurrent ? "0 0 0 4px rgba(139, 30, 63, 0.2)" : "none",
                              transition: "all 0.3s ease",
                              zIndex: 2,
                            }}
                          >
                            <Icon size={18} />
                          </div>
                          <strong
                            style={{
                              fontSize: "0.82rem",
                              marginTop: "8px",
                              color: isComplete ? "#8B1E3F" : "#777",
                            }}
                          >
                            {step.label}
                          </strong>
                          <span
                            style={{
                              fontSize: "0.72rem",
                              color: "#888",
                              marginTop: "2px",
                              display: "block",
                              lineHeight: 1.2,
                            }}
                          >
                            {step.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ordered Items with Visual Images */}
                <div style={{ marginTop: "1rem" }}>
                  <div
                    onClick={() => toggleExpand(orderKey)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      padding: "8px 0",
                      borderBottom: isExpanded ? "1px solid var(--line)" : "none",
                      marginBottom: isExpanded ? "14px" : 0,
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#333" }}>
                      Ordered Outfits & Attire ({order.items?.length || 0})
                    </span>
                    <button
                      type="button"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#8B1E3F",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {isExpanded ? "Hide Outfits" : "View Outfits"}
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
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
                                  width: "68px",
                                  height: "85px",
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
                                  sizes="68px"
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
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "6px",
                                    margin: "4px 0",
                                    flexWrap: "wrap",
                                  }}
                                >
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
                                  {formatPrice(item.price)} &times; {item.quantity} ={" "}
                                  <span>{formatPrice(item.price * item.quantity)}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p style={{ color: "#777", fontSize: "0.9rem" }}>No item details available.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Details */}
                <footer
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                    borderTop: "1px solid var(--line)",
                    marginTop: "18px",
                    paddingTop: "14px",
                    fontSize: "0.85rem",
                    color: "#555",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <MapPin size={16} color="#8B1E3F" />
                    <span>
                      <strong>Delivery to:</strong> {order.customerName} &bull; {order.shippingAddress},{" "}
                      {order.city}, {order.state} - {order.postalCode}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Link
                      className="buttonSecondary"
                      href={`/track-order?orderId=${order.orderNumber}`}
                      style={{ padding: "6px 14px", fontSize: "0.82rem", minHeight: "34px" }}
                    >
                      Track Order
                    </Link>
                  </div>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
