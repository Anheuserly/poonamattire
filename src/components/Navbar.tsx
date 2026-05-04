"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  Heart,
  Menu,
  PackageSearch,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCommerceStore } from "@/store/useCommerceStore";
import { useUiStore } from "@/store/useUiStore";
import styles from "./Navbar.module.css";

const navItems = [
  { href: "/shop", label: "New In" },
  { href: "/shop?category=Festive", label: "Festive" },
  { href: "/shop?category=Wedding", label: "Wedding" },
  { href: "/shop?category=Workwear", label: "Workwear" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const accountLinks = [
  { href: "/profile", label: "Dashboard" },
  { href: "/orders", label: "Orders" },
  { href: "/track-order", label: "Track order" },
  { href: "/shop", label: "Wishlist" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const customer = useAuthStore((state) => state.customer);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const openAuthModal = useUiStore((state) => state.openAuthModal);
  const cartCount = useCommerceStore((state) =>
    state.cart.reduce((count, item) => count + item.quantity, 0),
  );
  const wishlistCount = useCommerceStore((state) => state.wishlist.length);

  return (
    <>
      <div className={styles.announcement}>
        <span>Free styling help on WhatsApp</span>
        <span>COD and secure Razorpay ready</span>
        <span>Use POONAM10 for first order</span>
      </div>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Poonam Attire home">
          <Image
            src="/poonam-attire-logo.jpg"
            alt="Poonam Attire logo"
            width={58}
            height={58}
            priority
          />
          <span>
            <strong>Poonam Attire</strong>
            <small>Boutique</small>
          </span>
        </Link>
        <nav className={styles.nav} aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          <Link className={styles.track} href="/track-order">
            <PackageSearch size={18} /> Track
          </Link>
          <button className="iconButton" aria-label="Search products">
            <Search size={19} />
          </button>
          <div className={styles.account}>
            <button
              className={styles.accountButton}
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((value) => !value)}
            >
              <UserRound size={18} />
              <span>{customer ? customer.name.split(" ")[0] : "Login"}</span>
              <ChevronDown size={15} />
            </button>
            {accountOpen ? (
              <div className={styles.accountMenu}>
                {customer ? (
                  <>
                    <p>Signed in as {customer.email}</p>
                    {accountLinks.map((item) => (
                      <Link href={item.href} key={item.href}>
                        {item.label}
                      </Link>
                    ))}
                    <button onClick={logout}>Logout</button>
                  </>
                ) : (
                  <>
                    <p>Login to manage orders, addresses, reviews, and wishlist.</p>
                    <button className={styles.menuCta} onClick={() => openAuthModal("login")}>
                      Login
                    </button>
                    <button
                      onClick={() =>
                        login({
                          name: "Poonam Customer",
                          email: "customer@example.com",
                        })
                      }
                    >
                      Demo login
                    </button>
                  </>
                )}
              </div>
            ) : null}
          </div>
          <Link className={styles.badgedIcon} href="/shop" aria-label="Wishlist">
            <Heart size={19} />
            {wishlistCount > 0 ? <span>{wishlistCount}</span> : null}
          </Link>
          <Link className={styles.badgedIcon} href="/cart" aria-label="Cart">
            <ShoppingBag size={19} />
            {cartCount > 0 ? <span>{cartCount}</span> : null}
          </Link>
          <button
            className={styles.menu}
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>
      {open ? (
        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          {[...navItems, ...accountLinks].map((item) => (
            <Link href={item.href} key={`${item.href}-${item.label}`} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </>
  );
}
