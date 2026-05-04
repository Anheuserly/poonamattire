import Link from "next/link";
import { PackageCheck } from "lucide-react";
import { formatPrice } from "@/data/products";
import { orders, orderSteps } from "@/data/orders";
import styles from "./orders.module.css";

export const metadata = {
  title: "Orders",
};

export default function OrdersPage() {
  return (
    <main className={`${styles.orders} section`}>
      <div className="sectionHeader">
        <div>
          <p className="eyebrow">Orders</p>
          <h1 className="title">Manage every boutique order.</h1>
        </div>
        <Link className="buttonSecondary" href="/track-order">
          Track by ID
        </Link>
      </div>
      <div className={styles.list}>
        {orders.map((order) => (
          <article key={order.id}>
            <div className={styles.top}>
              <PackageCheck />
              <div>
                <h2>{order.id}</h2>
                <p>{order.items}</p>
              </div>
              <strong>{formatPrice(order.total)}</strong>
            </div>
            <div className={styles.timeline}>
              {orderSteps.map((step, index) => (
                <span className={index < order.step ? styles.done : ""} key={step}>
                  {step}
                </span>
              ))}
            </div>
            <footer>
              <span>{order.status}</span>
              <span>{order.eta}</span>
            </footer>
          </article>
        ))}
      </div>
    </main>
  );
}
