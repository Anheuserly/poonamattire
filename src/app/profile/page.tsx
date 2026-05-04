import Link from "next/link";
import {
  Heart,
  MapPin,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";
import { formatPrice } from "@/data/products";
import { orders } from "@/data/orders";
import styles from "./profile.module.css";

export const metadata = {
  title: "Profile Dashboard",
};

export default function ProfilePage() {
  return (
    <main className={`${styles.profile} section`}>
      <section className={styles.hero}>
        <div>
          <p className="eyebrow">Profile dashboard</p>
          <h1 className="title">A smarter account center for every shopper.</h1>
          <p className="copy">
            Login connects customer profiles, order history, saved addresses,
            wishlist, reviews, and return requests in one place.
          </p>
        </div>
        <div className={styles.memberCard}>
          <UserRound />
          <span>Demo customer</span>
          <strong>Premium boutique member</strong>
          <Link href="/login">Manage login</Link>
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
          <span>Wishlist</span>
          <strong>Saved looks</strong>
        </Link>
        <Link href="/contact">
          <RotateCcw />
          <span>Returns</span>
          <strong>7-day support</strong>
        </Link>
      </section>

      <section className={styles.dashboard}>
        <div className={styles.orders}>
          <div className="sectionHeader">
            <div>
              <p className="eyebrow">Recent orders</p>
              <h2>Track, review, reorder.</h2>
            </div>
          </div>
          {orders.map((order) => (
            <article key={order.id}>
              <div>
                <h3>{order.id}</h3>
                <p>{order.items}</p>
              </div>
              <span>{order.status}</span>
              <strong>{formatPrice(order.total)}</strong>
            </article>
          ))}
        </div>
        <aside className={styles.sidePanel}>
          <article>
            <MapPin />
            <h3>Saved address</h3>
            <p>Home / Surat, Gujarat / default delivery profile</p>
          </article>
          <article>
            <Star />
            <h3>Reviews due</h3>
            <p>Share fit and fabric feedback after delivery.</p>
          </article>
        </aside>
      </section>
    </main>
  );
}
