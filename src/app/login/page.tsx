"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, Phone, ShieldCheck, UserRound, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const customer = useAuthStore((state) => state.customer);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "login") {
      const res = await login(email, password);
      if (res.success) {
        router.push("/profile");
      } else {
        setError(res.error || "Login failed");
      }
    } else {
      if (!fullName.trim() || !phone.trim()) {
        setError("Please enter your name and phone number.");
        return;
      }
      const res = await register(email, password, fullName, phone);
      if (res.success) {
        router.push("/profile");
      } else {
        setError(res.error || "Registration failed");
      }
    }
  };

  if (customer) {
    return (
      <main className={`${styles.login} section`}>
        <section>
          <p className="eyebrow">Customer account</p>
          <h1 className="title">Welcome, {customer.fullName}!</h1>
          <p className="copy">
            Logged in as {customer.email} ({customer.phone}).
          </p>
          <div className={styles.status}>
            <ShieldCheck />
            Account active ({customer.role})
          </div>
        </section>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
          <Link className="button" href="/profile">
            Go to Profile & Orders
          </Link>
          <button className="buttonSecondary" onClick={logout}>
            Log out
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={`${styles.login} section`}>
      <section>
        <p className="eyebrow">{mode === "login" ? "Customer login" : "Join Poonam Attire"}</p>
        <h1 className="title">
          {mode === "login"
            ? "Access orders, addresses, wishlist, and returns."
            : "Create your boutique customer account."}
        </h1>
        <p className="copy">
          Login to keep delivery details, order tracking, returns, and wishlist
          activity connected to your boutique account.
        </p>
        <div className={styles.status}>
          <ShieldCheck />
          Secure PostgreSQL account
        </div>
      </section>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>
          <button
            type="button"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: mode === "login" ? 700 : 400,
              color: mode === "login" ? "#8B1E3F" : "#666",
              borderBottom: mode === "login" ? "2px solid #8B1E3F" : "none",
              paddingBottom: "4px"
            }}
            onClick={() => { setMode("login"); setError(null); }}
          >
            Sign in
          </button>
          <button
            type="button"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: mode === "register" ? 700 : 400,
              color: mode === "register" ? "#8B1E3F" : "#666",
              borderBottom: mode === "register" ? "2px solid #8B1E3F" : "none",
              paddingBottom: "4px"
            }}
            onClick={() => { setMode("register"); setError(null); }}
          >
            Create account
          </button>
        </div>

        {error && (
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
            <span>{error}</span>
          </div>
        )}

        {mode === "register" && (
          <>
            <label>
              Full name
              <span>
                <UserRound size={18} />
                <input
                  placeholder="Your Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </span>
            </label>
            <label>
              Phone / WhatsApp
              <span>
                <Phone size={18} />
                <input
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </span>
            </label>
          </>
        )}

        <label>
          Email
          <span>
            <Mail size={18} />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </span>
        </label>

        <label>
          Password
          <span>
            <LockKeyhole size={18} />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </span>
        </label>

        <button className="button" type="submit" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
          {isLoading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>

        <Link className="buttonSecondary" href="/profile">
          Continue to profile
        </Link>
      </form>
    </main>
  );
}
