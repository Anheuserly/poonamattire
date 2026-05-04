import Link from "next/link";
import Image from "next/image";
import { Camera, Mail } from "lucide-react";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Brand Section */}
      <div className={styles.brand}>
        <Image
          className={styles.logo}
          src="/poonam-attire-logo.jpg"
          alt="Poonam Attire Boutique logo"
          width={82}
          height={82}
        />
        <p className={styles.eyebrow}>Modern tradition</p>
        <h2 className={styles.title}>Poonam Attire</h2>
        <p className={styles.description}>
          Premium ethnic wear for women who love graceful silhouettes, fine
          fabrics, and festive details that feel timeless.
        </p>
      </div>

      {/* Navigation */}
      <div className={styles.links}>
        <h3>Explore</h3>
        <Link href="/shop">Shop Collection</Link>
        <Link href="/about">Our Story</Link>
        <Link href="/profile">Order Tracking</Link>
        <Link href="/contact">Contact</Link>
      </div>

      {/* Contact + Social */}
      <div className={styles.connect}>
        <h3>Connect</h3>

        <span className={styles.item}>
          <Mail size={16} /> care@poonamattire.com
        </span>

        <a
          href="https://www.instagram.com/poonamattire/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.item}
        >
          <Camera size={16} /> Instagram
        </a>
      </div>
    </footer>
  );
}