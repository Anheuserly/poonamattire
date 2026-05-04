import { ShopClient } from "@/components/ShopClient";
import styles from "./shop.module.css";

export const metadata = {
  title: "Shop",
};

export default function ShopPage() {
  return (
    <main>
      <section className={styles.hero}>
        <p className="eyebrow">Shop</p>
        <h1 className="title">Premium ethnic wear collection.</h1>
        <p className="copy">
          Explore salwar suits, kurta sets, wedding edits, breathable cottons,
          and festive silhouettes.
        </p>
      </section>
      <ShopClient />
    </main>
  );
}
