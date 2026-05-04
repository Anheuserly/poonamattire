import Link from "next/link";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import styles from "./login.module.css";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <main className={`${styles.login} section`}>
      <section>
        <p className="eyebrow">Customer login</p>
        <h1 className="title">Access orders, addresses, wishlist, and returns.</h1>
        <p className="copy">
          Login to keep delivery details, order tracking, returns, and wishlist
          activity connected to your boutique account.
        </p>
        <div className={styles.status}>
          <ShieldCheck />
          Secure customer account
        </div>
      </section>
      <form className={styles.form}>
        <label>
          Email
          <span>
            <Mail size={18} />
            <input placeholder="you@example.com" />
          </span>
        </label>
        <label>
          Password
          <span>
            <LockKeyhole size={18} />
            <input type="password" placeholder="Enter password" />
          </span>
        </label>
        <button className="button" type="button">
          Login
        </button>
        <Link className="buttonSecondary" href="/profile">
          Continue to dashboard
        </Link>
      </form>
    </main>
  );
}
