"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, LockKeyhole, Mail, Phone, UserRound, X } from "lucide-react";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUiStore } from "@/store/useUiStore";
import styles from "./AppShell.module.css";

export function AppShell() {
  const authModalOpen = useUiStore((state) => state.authModalOpen);
  const authMode = useUiStore((state) => state.authMode);
  const closeAuthModal = useUiStore((state) => state.closeAuthModal);
  const openAuthModal = useUiStore((state) => state.openAuthModal);
  const cartToast = useUiStore((state) => state.cartToast);
  const clearCartToast = useUiStore((state) => state.clearCartToast);
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    if (!cartToast) return;
    const timeout = window.setTimeout(clearCartToast, 3600);
    return () => window.clearTimeout(timeout);
  }, [cartToast, clearCartToast]);

  return (
    <>
      <AnimatePresence>
        {cartToast ? (
          <motion.aside
            className={styles.toast}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
          >
            <Image
              src={cartToast.product.image}
              alt={cartToast.product.name}
              width={74}
              height={92}
            />
            <div>
              <span>
                <CheckCircle2 size={17} /> Added to bag
              </span>
              <strong>{cartToast.product.name}</strong>
              <p>{cartToast.size ? `Size ${cartToast.size}` : "Default size selected"}</p>
            </div>
            <Link href="/cart">View bag</Link>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {authModalOpen ? (
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.section
              className={styles.modal}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
            >
              <button className={styles.close} onClick={closeAuthModal} aria-label="Close login modal">
                <X size={20} />
              </button>
              <div className={styles.modalIntro}>
                <Image
                  src="/poonam-attire-logo.jpg"
                  alt="Poonam Attire logo"
                  width={64}
                  height={64}
                />
                <p className="eyebrow">Member access</p>
                <h2>{authMode === "login" ? "Welcome back." : "Create your boutique account."}</h2>
                <p>
                  Save your cart, manage orders, track delivery, store addresses,
                  and receive styling help.
                </p>
              </div>
              <div className={styles.tabs}>
                <button
                  className={authMode === "login" ? styles.active : ""}
                  onClick={() => openAuthModal("login")}
                >
                  Login
                </button>
                <button
                  className={authMode === "register" ? styles.active : ""}
                  onClick={() => openAuthModal("register")}
                >
                  Register
                </button>
              </div>
              <form className={styles.form}>
                {authMode === "register" ? (
                  <label>
                    Name
                    <span>
                      <UserRound size={17} />
                      <input placeholder="Your full name" />
                    </span>
                  </label>
                ) : null}
                <label>
                  Email
                  <span>
                    <Mail size={17} />
                    <input placeholder="you@example.com" />
                  </span>
                </label>
                {authMode === "register" ? (
                  <label>
                    WhatsApp number
                    <span>
                      <Phone size={17} />
                      <input placeholder="+91 98765 43210" />
                    </span>
                  </label>
                ) : null}
                <label>
                  Password
                  <span>
                    <LockKeyhole size={17} />
                    <input type="password" placeholder="Password" />
                  </span>
                </label>
                <button
                  className="button"
                  type="button"
                  onClick={() => {
                    login();
                    closeAuthModal();
                  }}
                >
                  {authMode === "login" ? "Login" : "Create account"}
                </button>
              </form>
              <p className={styles.accountNote}>
                Your account keeps orders, addresses, returns, and support
                conversations organized in one place.
              </p>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
