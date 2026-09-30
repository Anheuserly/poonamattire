"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, LockKeyhole, Mail, Phone, UserRound, X, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
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
  const register = useAuthStore((state) => state.register);
  const initAuth = useAuthStore((state) => state.initAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!cartToast) return;
    const timeout = window.setTimeout(clearCartToast, 3600);
    return () => window.clearTimeout(timeout);
  }, [cartToast, clearCartToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (authMode === "login") {
      if (!email.trim() || !password.trim()) {
        setLocalError("Please enter your email and password.");
        return;
      }
      const res = await login(email, password);
      if (res.success) {
        closeAuthModal();
        setEmail("");
        setPassword("");
      } else {
        setLocalError(res.error || "Failed to log in.");
      }
    } else {
      if (!email.trim() || !password.trim() || !fullName.trim() || !phone.trim()) {
        setLocalError("Please fill in all fields (Name, Email, WhatsApp number, and Password).");
        return;
      }
      const res = await register(email, password, fullName, phone);
      if (res.success) {
        closeAuthModal();
        setEmail("");
        setPassword("");
        setFullName("");
        setPhone("");
      } else {
        setLocalError(res.error || "Failed to create account.");
      }
    }
  };

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
                  type="button"
                  className={authMode === "login" ? styles.active : ""}
                  onClick={() => {
                    setLocalError(null);
                    openAuthModal("login");
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={authMode === "register" ? styles.active : ""}
                  onClick={() => {
                    setLocalError(null);
                    openAuthModal("register");
                  }}
                >
                  Register
                </button>
              </div>

              {localError && (
                <div style={{
                  padding: "0.75rem 1rem",
                  background: "#fff0f2",
                  color: "#d32f2f",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <AlertCircle size={16} />
                  <span>{localError}</span>
                </div>
              )}

              <form className={styles.form} onSubmit={handleSubmit}>
                {authMode === "register" ? (
                  <label>
                    Name
                    <span>
                      <UserRound size={17} />
                      <input
                        placeholder="Your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </span>
                  </label>
                ) : null}

                <label>
                  Email
                  <span>
                    <Mail size={17} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </span>
                </label>

                {authMode === "register" ? (
                  <label>
                    WhatsApp / Phone number
                    <span>
                      <Phone size={17} />
                      <input
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </span>
                  </label>
                ) : null}

                <label>
                  Password
                  <span>
                    <LockKeyhole size={17} />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </span>
                </label>

                <button
                  className="button"
                  type="submit"
                  disabled={isLoading}
                  style={{ opacity: isLoading ? 0.7 : 1 }}
                >
                  {isLoading
                    ? "Processing..."
                    : authMode === "login"
                    ? "Login"
                    : "Create account"}
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
