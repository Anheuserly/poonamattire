import Link from "next/link";
import { PackageSearch, Search } from "lucide-react";
import styles from "./track-order.module.css";

export const metadata = {
  title: "Track Order",
};

export default function TrackOrderPage() {
  return (
    <main className={`${styles.track} section`}>
      <section>
        <p className="eyebrow">Track order</p>
        <h1 className="title">Know exactly where your outfit is.</h1>
        <p className="copy">
          Enter an order ID after checkout to see updates from confirmed to
          delivered in a clean customer timeline.
        </p>
      </section>
      <form className={styles.card}>
        <PackageSearch size={34} />
        <label>
          Order ID
          <span>
            <Search size={18} />
            <input placeholder="PA-24051" />
          </span>
        </label>
        <button className="button" type="button">
          Track order
        </button>
        <Link className="buttonSecondary" href="/orders">
          View my orders
        </Link>
      </form>
    </main>
  );
}
