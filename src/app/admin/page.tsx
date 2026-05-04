import { BarChart3, PackagePlus, ShoppingBag, Upload } from "lucide-react";
import { products } from "@/data/products";
import styles from "./admin.module.css";

export const metadata = {
  title: "Admin",
};

export default function AdminPage() {
  return (
    <main className={`${styles.admin} section`}>
      <div className="sectionHeader">
        <div>
          <p className="eyebrow">Admin panel</p>
          <h1 className="title">Manage products, orders, and insights.</h1>
        </div>
      </div>
      <div className={styles.stats}>
        <article>
          <PackagePlus />
          <strong>{products.length}</strong>
          <span>Products</span>
        </article>
        <article>
          <ShoppingBag />
          <strong>24</strong>
          <span>Open orders</span>
        </article>
        <article>
          <BarChart3 />
          <strong>92%</strong>
          <span>Conversion health</span>
        </article>
      </div>
      <section className={styles.panel}>
        <form>
          <h2>Add product</h2>
          <input placeholder="Product name" />
          <input placeholder="Price" />
          <select defaultValue="">
            <option value="">Category</option>
            <option>Festive</option>
            <option>Casual</option>
            <option>Wedding</option>
          </select>
          <button className="button" type="button">
            <Upload size={18} /> Upload images
          </button>
        </form>
        <div>
          <h2>Inventory</h2>
          {products.slice(0, 5).map((product) => (
            <article key={product.id}>
              <span>{product.name}</span>
              <strong>{product.category}</strong>
              <button>Edit</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
