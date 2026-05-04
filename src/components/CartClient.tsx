"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/data/products";
import { getCartSubtotal, useCommerceStore } from "@/store/useCommerceStore";
import { CheckoutGate } from "./CheckoutGate";
import styles from "./CartClient.module.css";

export function CartClient() {
  const cart = useCommerceStore((state) => state.cart);
  const coupon = useCommerceStore((state) => state.coupon);
  const updateQuantity = useCommerceStore((state) => state.updateQuantity);
  const removeFromCart = useCommerceStore((state) => state.removeFromCart);
  const applyCoupon = useCommerceStore((state) => state.applyCoupon);
  const subtotal = getCartSubtotal(cart);
  const discount = coupon === "POONAM10" ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 0 ? 99 : 0;
  const total = subtotal - discount + shipping;

  if (cart.length === 0) {
    return (
      <section className={`${styles.empty} section`}>
        <p className="eyebrow">Cart</p>
        <h1 className="title">Your cart is waiting for something beautiful.</h1>
        <Link className="button" href="/shop">
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <section className={`${styles.cart} section`}>
      <div>
        <p className="eyebrow">Cart</p>
        <h1 className="title">Review your selections.</h1>
        <div className={styles.items}>
          {cart.map((item) => (
            <article key={`${item.product.id}-${item.size}`}>
              <Image
                src={item.product.image}
                alt={item.product.name}
                width={160}
                height={200}
              />
              <div>
                <h2>{item.product.name}</h2>
                <p>Size {item.size}</p>
                <strong>{formatPrice(item.product.price)}</strong>
              </div>
              <div className={styles.quantity}>
                <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}>
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}>
                  <Plus size={16} />
                </button>
              </div>
              <button
                className={styles.remove}
                onClick={() => removeFromCart(item.product.id, item.size)}
                aria-label="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </article>
          ))}
        </div>
      </div>
      <aside className={styles.summary}>
        <h2>Order summary</h2>
        <label>
          Coupon
          <input
            placeholder="Try POONAM10"
            defaultValue={coupon}
            onBlur={(event) => applyCoupon(event.target.value)}
          />
        </label>
        <dl>
          <div>
            <dt>Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div>
            <dt>Discount</dt>
            <dd>-{formatPrice(discount)}</dd>
          </div>
          <div>
            <dt>Shipping</dt>
            <dd>{formatPrice(shipping)}</dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
        <CheckoutGate />
      </aside>
    </section>
  );
}
