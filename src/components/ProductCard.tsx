"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";
import { useCommerceStore } from "@/store/useCommerceStore";
import { useUiStore } from "@/store/useUiStore";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const addToCart = useCommerceStore((state) => state.addToCart);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);
  const wished = useCommerceStore((state) => state.wishlist.includes(product.id));
  const showCartToast = useUiStore((state) => state.showCartToast);

  function handleAddToCart() {
    addToCart(product);
    showCartToast({ product });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <motion.article
      className={styles.card}
      whileHover={{ y: -8, rotateX: 1.5, rotateY: -1.5 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
    >
      <Link href={`/product/${product.slug}`} className={styles.imageWrap}>
        <Image
          src={product.image}
          alt={product.name}
          width={620}
          height={780}
          sizes="(max-width: 760px) 100vw, 33vw"
        />
        <span>{product.tags[0]}</span>
      </Link>
      <div className={styles.content}>
        <div>
          <p>{product.category} / {product.fabric}</p>
          <Link href={`/product/${product.slug}`}>
            <h3>{product.name}</h3>
          </Link>
        </div>
        <button
          className={wished ? styles.wished : styles.wish}
          onClick={() => toggleWishlist(product.id)}
          aria-label="Add to wishlist"
        >
          <Heart size={18} fill={wished ? "currentColor" : "none"} />
        </button>
      </div>
      <div className={styles.meta}>
        <span>
          <Star size={16} fill="currentColor" /> {product.rating}
        </span>
        <strong>{formatPrice(product.price)}</strong>
        <small>{formatPrice(product.mrp)}</small>
      </div>
      <button className={added ? styles.cartAdded : styles.cart} onClick={handleAddToCart}>
        <ShoppingBag size={18} /> {added ? "Added" : "Add to cart"}
      </button>
    </motion.article>
  );
}
