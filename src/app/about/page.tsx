import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, HeartHandshake, Scissors, ArrowRight } from "lucide-react";
import styles from "./about.module.css";

export const metadata = {
  title: "About Our Boutique | Heritage & Artisanal Indian Wear | Poonam Attire",
  description:
    "Discover Poonam Attire's story — crafting timeless Indian festive wear, Chanderi kurtas, Banarasi weaves, and breathable handloom ensembles with master artisans.",
};

export default function AboutPage() {
  return (
    <main className={`${styles.about} section`}>
      <div className={styles.heroGrid}>
        <div style={{ position: "relative", width: "100%", height: "560px", borderRadius: "16px", overflow: "hidden" }}>
          <Image
            src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1100&q=80"
            alt="Poonam Attire handcrafted Indian festive wear"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
        <div>
          <p className="eyebrow">Our Heritage & Craft</p>
          <h1 className="title">Graceful ethnic wear crafted for celebrations and everyday elegance.</h1>
          <p className="copy">
            Founded with a passion for authentic Indian textile heritage, Poonam Attire
            celebrates the poetry of indigenous handlooms, zari-accented silhouettes, and
            contemporary drapes. We collaborate directly with master weavers across Jaipur,
            Chanderi, Lucknow, and Varanasi to bring you bespoke ethnic wear that breathes
            with you.
          </p>
          <div className={styles.values}>
            <span>
              <Sparkles size={16} /> Pure Handloom Silk & Chanderi
            </span>
            <span>
              <Scissors size={16} /> Bespoke Boutique Tailoring
            </span>
            <span>
              <ShieldCheck size={16} /> Verified Sizing & Fitting
            </span>
            <span>
              <HeartHandshake size={16} /> Direct Artisan Partnerships
            </span>
          </div>
          <div style={{ marginTop: "2rem" }}>
            <Link className="button" href="/shop">
              Explore 2026 Collection <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <section id="craftsmanship" style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid var(--line)" }}>
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Artisanal Dedication</p>
            <h2 className="title" style={{ fontSize: "2rem" }}>How Each Poonam Attire Ensemble Is Created</h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginTop: "1.5rem" }}>
          <article style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
            <strong style={{ color: "#8B1E3F", fontSize: "1.2rem", display: "block", marginBottom: "8px" }}>
              01. Hand-Selected Weaves
            </strong>
            <p style={{ color: "#666", lineHeight: 1.6, fontSize: "0.95rem" }}>
              Every yard of Chanderi silk, mulmul cotton, and organza is personally inspected for drape, breathability, and luster.
            </p>
          </article>
          <article style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
            <strong style={{ color: "#8B1E3F", fontSize: "1.2rem", display: "block", marginBottom: "8px" }}>
              02. Intricate Needlework
            </strong>
            <p style={{ color: "#666", lineHeight: 1.6, fontSize: "0.95rem" }}>
              From delicate Lucknowi Chikankari to gota patti and mirror work, each motif is embroidered by skilled heritage craftspersons.
            </p>
          </article>
          <article style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
            <strong style={{ color: "#8B1E3F", fontSize: "1.2rem", display: "block", marginBottom: "8px" }}>
              03. Precision Finishing & QC
            </strong>
            <p style={{ color: "#666", lineHeight: 1.6, fontSize: "0.95rem" }}>
              Double-stitched seams, soft inner lining, and generous seam margins ensure an exquisite drape and longevity.
            </p>
          </article>
        </div>
      </section>

      <section id="fabric-guide" style={{ marginTop: "4rem", background: "#fbf8f5", padding: "3rem 2rem", borderRadius: "16px" }}>
        <p className="eyebrow">Fabric Care Protocol</p>
        <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.8rem", margin: "6px 0 16px" }}>
          Caring for Your Heirloom Silks
        </h2>
        <p style={{ color: "#666", maxWidth: "680px", lineHeight: 1.7, fontSize: "0.95rem" }}>
          Pure Chanderi and Banarasi silk garments should be dry cleaned for their first three washes.
          For daily cotton kurtas, gentle cold-water hand wash with mild detergents preserves color brilliance and weave strength.
        </p>
      </section>
    </main>
  );
}
