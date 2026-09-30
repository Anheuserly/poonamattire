"use client";

import Link from "next/link";
import {
  Heart,
  MapPin,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Star,
  UserRound,
  LogOut,
  Mail,
  Phone,
} from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice } from "@/data/products";
import { useAuthStore } from "@/store/useAuthStore";
import { useUiStore } from "@/store/useUiStore";
import styles from "@/app/profile/profile.module.css";

export function ProfileClient() {
  const customer = useAuthStore((state) => state.customer);
  const logout = useAuthStore((state) => state.logout);
  const openAuthModal = useUiStore((state) => state.openAuthModal);

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!customer?.token) return;
    const fetchMyOrders = async () => {
      setLoadingOrders(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY || "PA_live_key_web_client_2026_poonam_hash";
        const res = await fetch("/api/auth/me", {
          headers: {
            "x-api-key": apiKey,
            Authorization: `Bearer ${customer.token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.orders) {
            setOrders(data.orders);
          }
        }
      } catch (err) {
        console.error("Failed to load profile orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchMyOrders();
  }, [customer]);

  if (!customer) {
    return (
      <main className={`${styles.profile} section`}>
        <section className={styles.hero}>
          <div>
            <p className="eyebrow">Profile dashboard</p>
            <h1 className="title">A smarter account center for every shopper.</h1>
            <p className="copy">
              Please sign in to view your orders, saved addresses, wishlist, and boutique member benefits.
            </p>
          </div>
          <div className={styles.memberCard}>
            <UserRound />
            <span>Guest shopper</span>
            <strong>Not signed in</strong>
            <button className="button" onClick={() => openAuthModal("login")}>
              Login / Join
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={`${styles.profile} section`}>
      <section className={styles.hero}>
        <div>
          <p className="eyebrow">Profile dashboard</p>
          <h1 className="title">Welcome, {customer.fullName}!</h1>
          <p className="copy" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "8px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <Mail size={16} /> {customer.email}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <Phone size={16} /> {customer.phone}
            </span>
          </p>
        </div>
        <div className={styles.memberCard}>
          <UserRound />
          <span>{customer.fullName}</span>
          <strong>{customer.role === "admin" ? "Boutique Administrator" : "Privileged Boutique Member"}</strong>
          <button
            onClick={logout}
            style={{
              background: "none",
              border: "none",
              color: "#8B1E3F",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              marginTop: "8px",
            }}
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </section>

      <section className={styles.quickGrid}>
        <Link href="/orders">
          <PackageCheck />
          <span>Orders</span>
          <strong>{orders.length} active</strong>
        </Link>
        <Link href="/track-order">
          <ShieldCheck />
          <span>Tracking</span>
          <strong>Live status</strong>
        </Link>
        <Link href="/shop">
          <Heart />
          <span>Catalog</span>
          <strong>Browse looks</strong>
        </Link>
        {customer.role === "admin" ? (
          <Link href="/admin" style={{ borderColor: "#8B1E3F" }}>
            <ShieldCheck color="#8B1E3F" />
            <span>Admin</span>
            <strong>Operations</strong>
          </Link>
        ) : (
          <Link href="/contact">
            <RotateCcw />
            <span>Returns</span>
            <strong>7-day support</strong>
          </Link>
        )}
      </section>

      <section className={styles.dashboard}>
        <div className={styles.orders}>
          <div className="sectionHeader">
            <div>
              <p className="eyebrow">Recent orders</p>
              <h2>Track, review, reorder.</h2>
            </div>
          </div>
          {orders.length === 0 ? (
            <p style={{ color: "#666", padding: "1rem 0" }}>No past orders found under this account.</p>
          ) : (
            orders.map((order) => (
              <article key={order.id}>
                <div>
                  <h3>#{order.order_number}</h3>
                  <p>Status: {order.order_status}</p>
                </div>
                <span>{order.payment_status}</span>
                <strong>{formatPrice(Number(order.total_amount))}</strong>
              </article>
            ))
          )}
        </div>
        <aside className={styles.sidePanel}>
          <article>
            <MapPin />
            <h3>Contact details</h3>
            <p>{customer.phone}</p>
            <p>{customer.email}</p>
          </article>
          <article>
            <Star />
            <h3>Poonam Attire Club</h3>
            <p>Direct priority tailoring & festive styling assistance.</p>
          </article>
        </aside>
      </section>
    </main>
  );
}
