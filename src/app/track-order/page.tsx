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
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { formatPrice } from "@/data/products";
import { useAuthStore } from "@/store/useAuthStore";
import { WhatsAppIcon } from "@/components/SocialIcons";
import styles from "./track-order.module.css";

const statusSteps = [
  {
    key: "confirmed",
    label: "Order Confirmed",
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
            const latest = data.orders[0];
            const num = latest.orderNumber || latest.order_number;
            setQueryId(num);
            track(num);
            return;
          }
        }
      } catch (e) {
        console.error("Failed to load user recent orders:", e);
      }

      // Fallback to active demo order
      track("PA-2026-4292");
    };

    fetchLatestOrParam();
  }, [customer?.token]);

  const track = async (id: string) => {
    const cleanId = id.trim();
    if (!cleanId) return;

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

  const getStatusBadgeClass = (status: string) => {
    const norm = (status || "").toLowerCase();
    if (norm === "delivered") return styles.badgeDelivered;
    if (norm === "shipped") return styles.badgeShipped;
    if (norm === "processing") return styles.badgeProcessing;
    if (norm === "cancelled") return styles.badgeCancelled;
    return styles.badgeConfirmed;
  };

  return (
    <main className={styles.trackPage}>
      {/* Top Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <p className="eyebrow">Real-Time Atelier Fulfillment</p>
            <h1 className={styles.headerTitle}>Order Tracking &amp; Dispatch Timeline</h1>
            <p className={styles.headerSubtitle}>
              Live fulfillment status, tailoring progress, and courier checkpoints for your handcrafted Poonam Attire outfits.
            </p>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className="buttonSecondary"
              onClick={() => setShowSearchBox(!showSearchBox)}
            >
              <Search size={16} />
              {showSearchBox ? "Hide Search" : "Track Another Order"}
            </button>
            <Link href="/orders" className="buttonSecondary">
              Back to All Orders
            </Link>
          </div>
        </div>

        {/* Quick order switcher pills */}
        {recentOrders.length > 0 && (
          <div className={styles.recentOrdersBar}>
            <span className={styles.recentOrdersLabel}>Your Recent Orders:</span>
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
                  className={`${styles.orderPill} ${isSelected ? styles.orderPillActive : ""}`}
                >
                  #{num} ({ro.orderStatus})
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Search Box (Collapsible) */}
      {showSearchBox && (
        <form className={styles.searchCard} onSubmit={handleSubmit}>
          <label>
            Enter Order Number (e.g. PA-2026-4292)
            <span>
              <Search size={18} />
              <input
                placeholder="Order Number"
                value={queryId}
                onChange={(e) => setQueryId(e.target.value)}
                required
              />
            </span>
          </label>
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Locating Order..." : "Search Order"}
          </button>
        </form>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <p style={{ color: "var(--primary)", fontWeight: 600 }}>Locating order and fetching real-time dispatch status...</p>
        </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <div style={{ background: "#ffebee", border: "1px solid #ffcdd2", color: "#c62828", padding: "16px 20px", borderRadius: "var(--radius)", marginBottom: "24px", display: "flex", gap: "10px", alignItems: "center" }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Order View */}
      {order && !loading && (
        <>
          {/* Hero Order Card */}
          <section className={styles.orderHeroCard}>
            <div className={styles.orderHeroHeader}>
              <div className={styles.orderMetaGroup}>
                <div className={styles.orderNumWrap}>
                  <span className={styles.orderNum}>#{order.orderNumber}</span>
                  <span className={`${styles.statusBadge} ${getStatusBadgeClass(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <div className={styles.orderSubDetails}>
                  <span>
                    <Calendar size={15} /> Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span>
                    Recipient: <strong>{order.customerName}</strong>
                  </span>
                  <span>
                    Contact: <strong>{order.customerPhone}</strong>
                  </span>
                </div>
              </div>

              <div className={styles.orderFinancials}>
                <span className={styles.totalAmount}>{formatPrice(order.totalAmount)}</span>
                <span className={styles.paymentMode}>
                  Payment: <strong>{paymentMethodStr}</strong> ({order.paymentStatus || "Pending"})
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className={styles.stepperWrap}>
              <div className={styles.stepperGrid}>
                {statusSteps.map((step, idx) => {
                  const currentIdx = getStepIndex(order.orderStatus);
                  const isDone = idx < currentIdx;
                  const isActive = idx === currentIdx;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.key}
                      className={`${styles.stepItem} ${isActive ? styles.stepItemActive : ""} ${isDone ? styles.stepItemDone : ""}`}
                    >
                      <div className={styles.stepIconWrap}>
                        <Icon size={20} />
                      </div>
                      <span className={styles.stepLabel}>{step.label}</span>
                      <p className={styles.stepDesc}>{step.desc}</p>
                      <span className={styles.stepTime}>{step.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Main 2-Column Content Split */}
          <div className={styles.contentSplit}>
            {/* Left Column: Outfits List */}
            <section className={styles.outfitsSection}>
              <h2 className={styles.sectionHeading}>
                <span>Ordered Handcrafted Outfits</span>
                <span style={{ fontSize: "0.95rem", color: "var(--muted)", fontWeight: 500 }}>
                  ({order.items?.length || 0} {order.items?.length === 1 ? "Piece" : "Pieces"})
                </span>
              </h2>

              <div className={styles.outfitsList}>
                {order.items?.map((item: any, idx: number) => {
                  const imgSrc = item.imageUrl || item.image || "https://images.unsplash.com/photo-1594226801341-41427b4e5c22?auto=format&fit=crop&w=600&q=80";
                  const unitPrice = Number(item.price) || 0;
                  const quantity = Number(item.quantity) || 1;
                  const lineTotal = unitPrice * quantity;

                  return (
                    <article key={idx} className={styles.outfitCard}>
                      <Image
                        src={imgSrc}
                        alt={item.productName || "Attire item"}
                        width={80}
                        height={100}
                        className={styles.outfitImage}
                      />
                      <div className={styles.outfitInfo}>
                        <span className={styles.outfitTitle}>{item.productName}</span>
                        <div className={styles.outfitBadges}>
                          <span className={styles.sizeBadge}>Size: {item.size || "M"}</span>
                          <span className={styles.qtyBadge}>Qty: {quantity}</span>
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                          Hand-tailored finishing with authentic luxury lining
                        </span>
                      </div>

                      <div className={styles.outfitPricing}>
                        <strong className={styles.outfitTotal}>{formatPrice(lineTotal)}</strong>
                        <span className={styles.outfitUnitPrice}>
                          {quantity > 1 ? `${formatPrice(unitPrice)} × ${quantity}` : "Standard boutique rate"}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Right Column: Address, Financials & Concierge */}
            <aside className={styles.sidebar}>
              {/* Shipping Destination */}
              <div className={styles.sideCard}>
                <h3>
                  <MapPin size={17} /> Shipping Destination
                </h3>
                <div className={styles.addressBlock}>
                  <strong>{order.customerName}</strong>
                  <span>{order.shippingAddress}</span>
                  <span>{order.city}, {order.state} - {order.postalCode}</span>
                  <span style={{ marginTop: "4px", color: "var(--muted)", fontSize: "0.82rem" }}>
                    Special Instructions: {order.notes || "Standard boutique express delivery"}
                  </span>
                </div>
              </div>

              {/* Price & Billing Summary */}
              <div className={styles.sideCard}>
                <h3>Payment Summary</h3>
                <div className={styles.priceBreakdown}>
                  <div className={styles.priceRow}>
                    <span>Items Subtotal</span>
                    <span>{formatPrice(order.subtotal || order.totalAmount)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className={styles.priceRow} style={{ color: "#2e7d32" }}>
                      <span>Boutique Savings</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className={styles.priceRow}>
                    <span>Boutique Express Delivery</span>
                    <span style={{ color: "#2e7d32", fontWeight: 600 }}>FREE</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span>Packaging &amp; Handling</span>
                    <span style={{ color: "#2e7d32", fontWeight: 600 }}>COMPLIMENTARY</span>
                  </div>
                  <div className={styles.priceTotalRow}>
                    <span>Total Order Value</span>
                    <span style={{ color: "var(--primary)" }}>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* VIP Concierge Support Card */}
              <div className={styles.supportCard}>
                <h4>Need Fit or Delivery Assistance?</h4>
                <p>
                  Our atelier stylists are available to provide alteration guidance, expedited delivery arrangements, or address updates.
                </p>
                <a
                  href={`https://wa.me/919810012345?text=Hello%20Poonam%20Attire,%20I%20need%20assistance%20with%20my%20order%20%23${order.orderNumber}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappBtn}
                >
                  <WhatsAppIcon size={18} color="#fff" />
                  Chat on WhatsApp
                </a>
              </div>
            </aside>
          </div>
        </>
      )}
    </main>
  );
}
