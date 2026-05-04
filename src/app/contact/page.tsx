import { Camera, Mail, MapPin, Phone } from "lucide-react";
import styles from "./contact.module.css";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <main className={`${styles.contact} section`}>
      <div>
        <p className="eyebrow">Contact</p>
        <h1 className="title">We would love to help you choose.</h1>
        <p className="copy">
          Reach out for size guidance, order support, festive styling help, or
          boutique inquiries.
        </p>
        <div className={styles.cards}>
          <span>
            <Phone size={18} /> +91 98765 43210
          </span>
          <span>
            <Mail size={18} /> care@poonamattire.com
          </span>
          <span>
            <MapPin size={18} /> Surat, Gujarat
          </span>
          <a href="https://www.instagram.com/poonamattire/">
            <Camera size={18} /> @poonamattire
          </a>
        </div>
      </div>
      <form className={styles.form}>
        <label>
          Name
          <input placeholder="Your name" />
        </label>
        <label>
          Email
          <input placeholder="you@example.com" />
        </label>
        <label>
          Message
          <textarea placeholder="How can we help?" />
        </label>
        <button className="button" type="button">
          Send message
        </button>
      </form>
    </main>
  );
}
