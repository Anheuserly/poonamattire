"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Heart, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";
import { useCommerceStore } from "@/store/useCommerceStore";
import { useUiStore } from "@/store/useUiStore";
import styles from "./ProductDetailClient.module.css";

const MannequinPreview = dynamic(
  () => import("./MannequinPreview").then((module) => module.MannequinPreview),
  { ssr: false, loading: () => <div className={styles.previewLoading}>Loading 3D preview</div> },
);

export function ProductDetailClient({ product }: { product: Product }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [show3d, setShow3d] = useState(false);
  const cart = useCommerceStore((state) => state.cart);
  const addToCart = useCommerceStore((state) => state.addToCart);
  const updateQuantity = useCommerceStore((state) => state.updateQuantity);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);
  const addRecentlyViewed = useCommerceStore((state) => state.addRecentlyViewed);
  const wished = useCommerceStore((state) => state.wishlist.includes(product.id));
  const showCartToast = useUiStore((state) => state.showCartToast);

  const cartItem = cart.find(
    (item) => item.product.id === product.id && item.size === size,
  );
  const inBagQty = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    addRecentlyViewed(product);
  }, [addRecentlyViewed, product]);

  function handleAddToCart() {
    addToCart(product, size);
    showCartToast({ product, size });
  }

  return (
    <section className={`${styles.detail} section`}>
      <div className={styles.gallery}>
        {show3d ? (
          <MannequinPreview />
        ) : (
          product.gallery.map((image) => (
            <Image
              key={image}
              src={image}
              alt={product.name}
              width={760}
              height={940}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          ))
        )}
      </div>
      <div className={styles.info}>
        <p className="eyebrow">{product.category} / {product.fabric}</p>
        <h1 className="title">{product.name}</h1>
        <div className={styles.rating}>
          <Star size={17} fill="currentColor" />
          {product.rating} ({product.reviews} reviews)
        </div>
        <div className={styles.price}>
          <strong>{formatPrice(product.price)}</strong>
          <span>{formatPrice(product.mrp)}</span>
        </div>
        <p className="copy">{product.description}</p>
        <div className={styles.fabricStory}>
          <article>
            <span>Fabric</span>
            <strong>{product.fabric}</strong>
          </article>
          <article>
            <span>Color story</span>
            <strong>{product.color}</strong>
          </article>
          <article>
            <span>Occasion</span>
            <strong>{product.category}</strong>
          </article>
        </div>
        <div className={styles.switcher}>
          <button className={!show3d ? styles.active : ""} onClick={() => setShow3d(false)}>
            Gallery
          </button>
          <button className={show3d ? styles.active : ""} onClick={() => setShow3d(true)}>
            3D Preview
          </button>
        </div>
        <div>
          <h2>Size</h2>
          <div className={styles.sizes}>
            {product.sizes.map((item) => (
              <button
                className={size === item ? styles.activeSize : ""}
                key={item}
                onClick={() => setSize(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        {inBagQty > 0 ? (
          <div className={styles.inBagBlock}>
            <div className={styles.inBagStatus}>
              <CheckCircle2 size={16} />
              <span>
                Size <strong>{size}</strong> is in your shopping bag ({inBagQty} {inBagQty > 1 ? "items" : "item"})
              </span>
            </div>
            <div className={styles.actions}>
              <Link href="/cart" className={styles.viewBagButton}>
                <ShoppingBag size={18} /> View Bag &amp; Checkout ({inBagQty}) &rarr;
              </Link>
              <div className={styles.qtyControl}>
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, size, inBagQty - 1)}
                  aria-label="Decrease quantity"
                >
                  &minus;
                </button>
                <span>{inBagQty}</span>
                <button
                  type="button"
                  onClick={() => addToCart(product, size)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="buttonSecondary"
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart size={18} fill={wished ? "currentColor" : "none"} />
                {wished ? "Wishlisted" : "Wishlist"}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.actions}>
            <button type="button" className="button" onClick={handleAddToCart}>
              <ShoppingBag size={18} /> Add to bag
            </button>
            <button
              type="button"
              className="buttonSecondary"
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart size={18} fill={wished ? "currentColor" : "none"} />
              {wished ? "Wishlisted" : "Wishlist"}
            </button>
          </div>
        )}
        <div className={styles.notes}>
          <span>Secure Razorpay checkout ready</span>
          <span>Ships in 24-48 hours after confirmation</span>
          <span>Easy 7-day exchange with fit support</span>
          <span>Fabric care: gentle hand wash, dry in shade</span>
        </div>
      </div>
    </section>
  );
}
