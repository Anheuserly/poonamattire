import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { YoutubeIcon, InstagramIcon, FacebookIcon, WhatsAppIcon } from "@/components/SocialIcons";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Atelier Social Hub Band */}
      <div className={styles.socialBanner}>
        <div className={styles.socialBannerHeader}>
          <p className={styles.socialEyebrow}>Connect With Our Atelier</p>
          <h3 className={styles.socialTitle}>Follow Poonam Attire Across Socials</h3>
          <p className={styles.socialSubtitle}>
            Watch exclusive festive draping guides, explore real bride transformations, and stay updated with our newest handcrafted drops.
          </p>
        </div>

        <div className={styles.socialCardsGrid}>
          {/* YouTube Card */}
          <a
            href="https://www.youtube.com/@PoonamsAttire06"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.socialCard} ${styles.ytCard}`}
          >
            <div className={styles.socialCardIconWrap}>
              <YoutubeIcon size={24} color="#ff0000" />
            </div>
            <div className={styles.socialCardContent}>
              <div className={styles.socialCardTop}>
                <strong>YouTube</strong>
                <span className={styles.socialHandle}>@PoonamsAttire06</span>
              </div>
              <p>Watch saree styling, Anarkali flares & weaving craftsmanship videos.</p>
              <span className={styles.socialAction}>
                Subscribe &amp; Watch <ArrowUpRight size={14} />
              </span>
            </div>
          </a>

          {/* Instagram Card */}
          <a
            href="https://www.instagram.com/poonamsattire06/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.socialCard} ${styles.igCard}`}
          >
            <div className={styles.socialCardIconWrap}>
              <InstagramIcon size={22} color="#e1306c" />
            </div>
            <div className={styles.socialCardContent}>
              <div className={styles.socialCardTop}>
                <strong>Instagram</strong>
                <span className={styles.socialHandle}>@poonamsattire06</span>
              </div>
              <p>Daily new ethnic arrivals, customer reels & festive lookbooks.</p>
              <span className={styles.socialAction}>
                Follow @poonamsattire06 <ArrowUpRight size={14} />
              </span>
            </div>
          </a>

          {/* Facebook Card */}
          <a
            href="https://www.facebook.com/poonamsattire06/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.socialCard} ${styles.fbCard}`}
          >
            <div className={styles.socialCardIconWrap}>
              <FacebookIcon size={22} color="#1877f2" />
            </div>
            <div className={styles.socialCardContent}>
              <div className={styles.socialCardTop}>
                <strong>Facebook</strong>
                <span className={styles.socialHandle}>Poonam Attire</span>
              </div>
              <p>Boutique exhibitions, festive collections & community reviews.</p>
              <span className={styles.socialAction}>
                Join Community <ArrowUpRight size={14} />
              </span>
            </div>
          </a>

          {/* WhatsApp VIP Concierge */}
          <a
            href="https://wa.me/919810012345?text=Hello%20Poonam%20Attire,%20I%20would%20like%20assistance%20with%20sizing%20and%20orders."
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.socialCard} ${styles.waCard}`}
          >
            <div className={styles.socialCardIconWrap}>
              <WhatsAppIcon size={22} color="#25d366" />
            </div>
            <div className={styles.socialCardContent}>
              <div className={styles.socialCardTop}>
                <strong>WhatsApp VIP</strong>
                <span className={styles.socialHandle}>+91 98100 12345</span>
              </div>
              <p>Direct concierge for custom fittings, video shopping & orders.</p>
              <span className={styles.socialAction}>
                Chat with Stylist <ArrowUpRight size={14} />
              </span>
            </div>
          </a>
        </div>
      </div>

      <div className={styles.container}>
        {/* Brand & Story */}
        <div className={styles.brand}>
          <Image
            className={styles.logo}
            src="/poonam-attire-logo.jpg"
            alt="Poonam Attire Boutique logo"
            width={76}
            height={76}
          />
          <p className={styles.eyebrow}>Modern Indian Luxury</p>
          <h2 className={styles.title}>Poonam Attire</h2>
          <p className={styles.description}>
            Handcrafted ethnic wear celebrating timeless Indian weaves, artisanal
            embroidery, and contemporary festive silhouettes. Made with pure Chanderi,
            Banarasi silk, and organic cottons.
          </p>
          <Link href="/about" className={styles.aboutStoryBtn}>
            Discover Our Story &amp; Heritage &rarr;
          </Link>
        </div>

        {/* Collections */}
        <div className={styles.column}>
          <h3>Collections</h3>
          <Link href="/shop?category=Festive">Festive Salwar Sets</Link>
          <Link href="/shop?category=Wedding">Wedding Guest Edit</Link>
          <Link href="/shop?category=Occasion">Noor Chanderi Kurtas</Link>
          <Link href="/shop?category=Casual">Everyday Handloom Cotton</Link>
          <Link href="/shop?category=Workwear">Workwear Classics</Link>
          <Link href="/shop">View All 2026 Looks</Link>
        </div>

        {/* About & Craft */}
        <div className={styles.column}>
          <h3>About the Atelier</h3>
          <Link href="/about">About Poonam Attire</Link>
          <Link href="/about#craftsmanship">Artisanal Craftsmanship</Link>
          <Link href="/about#fabric-guide">Fabric &amp; Silk Care Guide</Link>
          <Link href="/track-order">Live Order Tracking</Link>
          <Link href="/profile">Customer Account</Link>
          <Link href="/contact">Boutique Appointments</Link>
          <Link href="/admin">Atelier Admin Portal</Link>
        </div>

        {/* Contact & Concierge */}
        <div className={styles.column}>
          <h3>Concierge &amp; Support</h3>
          <span className={styles.item}>
            <Mail size={15} /> care@poonamattire.com
          </span>
          <span className={styles.item}>
            <Phone size={15} /> +91 98100 12345 (WhatsApp)
          </span>
          <span className={styles.item}>
            <Clock size={15} /> Mon - Sat: 10:00 AM - 7:30 PM
          </span>
          <span className={styles.item}>
            <MapPin size={15} /> Atelier: Linking Road, Bandra West, Mumbai &amp; Jaipur
          </span>
          <a
            href="https://www.youtube.com/@PoonamsAttire06"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.item}
          >
            <YoutubeIcon size={15} /> YouTube @PoonamsAttire06
          </a>
          <a
            href="https://www.instagram.com/poonamsattire06/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.item}
          >
            <InstagramIcon size={15} /> Instagram @poonamsattire06
          </a>
          <a
            href="https://www.facebook.com/poonamsattire06/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.item}
          >
            <FacebookIcon size={15} /> Facebook @poonamsattire06
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} Poonam Attire Boutique. All rights reserved.</p>
        <div className={styles.bottomLinks}>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Support</Link>
          <Link href="/track-order">Track Orders</Link>
        </div>
      </div>
    </footer>
  );
}