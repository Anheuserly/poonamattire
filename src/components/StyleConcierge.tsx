"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, WandSparkles } from "lucide-react";
import { formatPrice, products } from "@/data/products";
import styles from "./StyleConcierge.module.css";

const occasions = ["Festive", "Workwear", "Wedding", "Casual"];
const moods = ["Elegant", "Lightweight", "Statement"];

export function StyleConcierge() {
  const [occasion, setOccasion] = useState("Festive");
  const [mood, setMood] = useState("Elegant");

  const recommendation = useMemo(() => {
    const exact = products.find((product) => product.category === occasion);
    return exact ?? products[0];
  }, [occasion]);

  return (
    <section className={styles.concierge}>
      <div>
        <p className="eyebrow">Style concierge</p>
        <h2 className="title">Find the right outfit in under a minute.</h2>
        <p className="copy">
          Choose the moment and the mood. The boutique edit narrows the first
          pick for you, then you can continue shopping with a clearer eye.
        </p>
      </div>
      <div className={styles.panel}>
        <div>
          <span>Occasion</span>
          <div className={styles.pills}>
            {occasions.map((item) => (
              <button
                className={occasion === item ? styles.active : ""}
                key={item}
                onClick={() => setOccasion(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span>Mood</span>
          <div className={styles.pills}>
            {moods.map((item) => (
              <button
                className={mood === item ? styles.active : ""}
                key={item}
                onClick={() => setMood(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <article className={styles.result}>
          <WandSparkles />
          <div>
            <p>Recommended first try</p>
            <h3>{recommendation.name}</h3>
            <span>
              {recommendation.fabric} / {mood} / {formatPrice(recommendation.price)}
            </span>
          </div>
          <Link href={`/product/${recommendation.slug}`} aria-label="View recommendation">
            <ArrowRight size={20} />
          </Link>
        </article>
      </div>
    </section>
  );
}
