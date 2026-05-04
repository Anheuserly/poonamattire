"use client";

import { useMemo, useState } from "react";
import { Grid2X2, List, Search } from "lucide-react";
import { products } from "@/data/products";
import { ProductGrid } from "./ProductGrid";
import styles from "./ShopClient.module.css";

const categories = ["All", ...Array.from(new Set(products.map((item) => item.category)))];
const fabrics = ["All", ...Array.from(new Set(products.map((item) => item.fabric)))];

export function ShopClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [fabric, setFabric] = useState("All");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    return products
      .filter((product) => {
        const matchesQuery = `${product.name} ${product.color} ${product.fabric}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesCategory = category === "All" || product.category === category;
        const matchesFabric = fabric === "All" || product.fabric === fabric;
        return matchesQuery && matchesCategory && matchesFabric;
      })
      .sort((a, b) => {
        if (sort === "low") return a.price - b.price;
        if (sort === "high") return b.price - a.price;
        if (sort === "rating") return b.rating - a.rating;
        return b.reviews - a.reviews;
      });
  }, [category, fabric, query, sort]);

  return (
    <section className={`${styles.shop} section`}>
      <aside className={styles.filters}>
        <h2>Refine your edit</h2>
        <label className={styles.search}>
          <Search size={18} />
          <input
            placeholder="Search maroon, cotton, zari..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label>
          Occasion
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Fabric
          <select value={fabric} onChange={(event) => setFabric(event.target.value)}>
            {fabrics.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <div className={styles.swatches}>
          {["#8B1E3F", "#F5E6E8", "#D4AF37", "#0F766E", "#EAB308"].map((color) => (
            <span style={{ background: color }} key={color} />
          ))}
        </div>
      </aside>
      <div>
        <div className={styles.toolbar}>
          <span>{filtered.length} styles matched</span>
          <div>
            <button
              className={view === "grid" ? styles.active : ""}
              aria-label="Grid view"
              onClick={() => setView("grid")}
            >
              <Grid2X2 size={18} />
            </button>
            <button
              className={view === "list" ? styles.active : ""}
              aria-label="List view"
              onClick={() => setView("list")}
            >
              <List size={18} />
            </button>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">Featured</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </div>
        <div className={view === "list" ? styles.listMode : ""}>
          <ProductGrid products={filtered} />
        </div>
      </div>
    </section>
  );
}
