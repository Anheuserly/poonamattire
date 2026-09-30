import { Mail, MapPin, Phone } from "lucide-react";
import { YoutubeIcon, InstagramIcon, FacebookIcon, WhatsAppIcon } from "@/components/SocialIcons";
import styles from "./contact.module.css";

export const metadata = {
  title: "Contact Atelier & Concierge | Poonam Attire",
  description: "Connect with Poonam Attire boutique concierge for styling advice, custom sizing, bridal appointments, and order assistance.",
};

export default function ContactPage() {
  return (
    <main className={`${styles.contact} section`}>
      <div>
        <p className="eyebrow">Concierge &amp; Styling Support</p>
        <h1 className="title">We would love to assist you.</h1>
        <p className="copy">
          Reach out for custom sizing assistance, blouse alterations, bridal styling, or order tracking support. We are available on WhatsApp, phone, and across our official social channels.
        </p>
        <div className={styles.cards}>
          <a
            href="https://wa.me/919810012345?text=Hello%20Poonam%20Attire,%20I%20would%20like%20assistance."
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon size={20} color="#25d366" />
            <span>WhatsApp Concierge: +91 98100 12345</span>
          </a>
          <span>
            <Phone size={18} /> Direct Call: +91 98100 12345
          </span>
          <span>
            <Mail size={18} /> Concierge Email: care@poonamattire.com
          </span>
          <span>
            <MapPin size={18} /> Atelier: Linking Road, Bandra West, Mumbai &amp; Jaipur
          </span>
          <a
            href="https://www.youtube.com/@PoonamsAttire06"
            target="_blank"
            rel="noopener noreferrer"
          >
            <YoutubeIcon size={20} color="#ff0000" />
            <span>Watch Drapes on YouTube: @PoonamsAttire06</span>
          </a>
          <a
            href="https://www.instagram.com/poonamsattire06/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon size={20} color="#e1306c" />
            <span>Follow on Instagram: @poonamsattire06</span>
          </a>
          <a
            href="https://www.facebook.com/poonamsattire06/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon size={20} color="#1877f2" />
            <span>Join Community on Facebook: Poonam Attire</span>
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
