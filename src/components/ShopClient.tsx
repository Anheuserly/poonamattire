"use client";

import { useEffect, useMemo, useState } from "react";
import { Grid2X2, List, Search, RefreshCw } from "lucide-react";
import { products as initialProducts, Product } from "@/data/products";
import { ProductGrid } from "./ProductGrid";
import styles from "./ShopClient.module.css";

export function ShopClient() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [fabric, setFabric] = useState("All");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLiveProducts = async () => {
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY || "PA_live_key_web_client_2026_poonam_hash";
        const res = await fetch("/api/products", {
          headers: { "x-api-key": apiKey },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.products) && data.products.length > 0) {
            setProductList(data.products);
          }
        }
      } catch (e) {
        console.error("Failed to load live products from API:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveProducts();
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(productList.map((item) => item.category)))], [productList]);
  const fabrics = useMemo(() => ["All", ...Array.from(new Set(productList.map((item) => item.fabric)))], [productList]);

  const filtered = useMemo(() => {
    return productList
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
  }, [category, fabric, productList, query, sort]);

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
        <label>
          Sort by
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured / Popular</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </label>
      </aside>

      <div className={styles.content}>
        <div className={styles.topbar}>
          <p>
            Showing <strong>{filtered.length}</strong> handcrafted outfits
            {loading ? " (syncing live...)" : ""}
          </p>
          <div className={styles.viewToggle}>
            <button
              className={view === "grid" ? styles.active : ""}
              onClick={() => setView("grid")}
              type="button"
              aria-label="Grid view"
            >
              <Grid2X2 size={18} />
            </button>
            <button
              className={view === "list" ? styles.active : ""}
              onClick={() => setView("list")}
              type="button"
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <ProductGrid products={filtered} />
      </div>
    </section>
  );
}
