import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gem, Search, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { collections, products } from "@/data/products";
import { ProductGrid } from "@/components/ProductGrid";
import { StyleConcierge } from "@/components/StyleConcierge";
import styles from "./home.module.css";

const testimonials = [
  "The fabric felt premium and the fitting was exactly right for Diwali.",
  "Beautiful packaging, quick delivery, and the maroon suit looked even better in person.",
  "Elegant styles without the heavy boutique price. I keep coming back.",
];

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Poonam Attire",
    url: "https://poonamattire.com",
    sameAs: ["https://www.instagram.com/poonamattire/"],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBrand}>
            <Image
              src="/poonam-attire-logo.jpg"
              alt="Poonam Attire Boutique logo"
              width={74}
              height={74}
              priority
            />
            <span>Boutique festive edit 2026</span>
          </div>
          <h1 className="display">Elegant salwar suits for every occasion.</h1>
          <p>
            Premium ethnic wear with boutique polish, soft fabrics, elegant
            color stories, and guided shopping that helps every outfit feel
            intentional.
          </p>
          <div className={styles.heroActions}>
            <Link className="button" href="/shop">
              Shop collection <ArrowRight size={18} />
            </Link>
            <Link className="buttonSecondary" href="/track-order">
              Track order
            </Link>
          </div>
          <form className={styles.heroFinder}>
            <Search size={19} />
            <input aria-label="Search outfits" placeholder="Search cotton, festive, maroon, wedding..." />
            <Link href="/shop?category=Festive">Find outfit</Link>
          </form>
          <div className={styles.heroStats}>
            <span>4.8 shopper rating</span>
            <span>7-day exchange</span>
            <span>Festive styling support</span>
          </div>
        </div>
        <div className={styles.heroVisual} aria-label="Poonam Attire style board">
          <div className={styles.lotusCard}>
            <Image
              src="/poonam-attire-logo.jpg"
              alt="Poonam Attire Boutique logo"
              width={150}
              height={150}
              priority
            />
            <span>Lotus boutique edit</span>
          </div>
          <div className={styles.fabricBoard}>
            <span />
            <span />
            <span />
            <span />
          </div>
          <aside className={styles.heroPanel}>
            <p className="eyebrow">Today&apos;s boutique pick</p>
            <h2>Gulab Zari Salwar Suit</h2>
            <p>Deep maroon, zari-inspired detail, and 3D preview for confident buying.</p>
            <Link href="/product/gulab-zari-salwar-suit">
              Preview the look <ArrowRight size={17} />
            </Link>
          </aside>
          <div className={styles.categoryDock}>
            {["Festive", "Wedding", "Cotton", "Workwear"].map((item) => (
              <Link href="/shop" key={item}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.promise}>
        <span>
          <Sparkles size={20} /> Zari-inspired festive detailing
        </span>
        <span>
          <Truck size={20} /> Fast shipping across India
        </span>
        <span>COD, Razorpay, and secure checkout ready</span>
      </section>

      <section className={styles.editorial}>
        <div>
          <p className="eyebrow">Boutique point of view</p>
          <h2>Less searching. More perfect first picks.</h2>
        </div>
        <div className={styles.editorialGrid}>
          <article>
            <Gem />
            <h3>Occasion edits</h3>
            <p>Wedding guest, puja, workwear, and everyday cotton collections.</p>
          </article>
          <article>
            <ShieldCheck />
            <h3>Fit confidence</h3>
            <p>Clear size choices, exchange promise, and outfit detail notes.</p>
          </article>
          <article>
            <Sparkles />
            <h3>Premium discovery</h3>
            <p>3D preview, fabric cues, wishlist, recently viewed, and coupons.</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Featured collections</p>
            <h2 className="title">Curated for modern tradition.</h2>
          </div>
          <Link className="buttonSecondary" href="/shop">
            Browse all
          </Link>
        </div>
        <div className={styles.collections}>
          {collections.map((collection) => (
            <article key={collection.name}>
              <Image
                src={collection.image}
                alt={collection.name}
                width={700}
                height={820}
                sizes="(max-width: 760px) 100vw, 33vw"
              />
              <div>
                <h3>{collection.name}</h3>
                <p>{collection.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <StyleConcierge />

      <section className={`${styles.blush} section`}>
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Trending now</p>
            <h2 className="title">Bestsellers with graceful detail.</h2>
          </div>
        </div>
        <ProductGrid products={products.slice(0, 3)} />
      </section>

      <section className={`${styles.storyBand} section`}>
        <div>
          <p className="eyebrow">Category highlights</p>
          <h2 className="title">From cotton workwear to wedding guest shimmer.</h2>
        </div>
        <div className={styles.categoryGrid}>
          {["Festive", "Casual", "Wedding", "Workwear"].map((item) => (
            <Link href={`/shop?category=${item}`} key={item}>
              {item}
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Loved by shoppers</p>
            <h2 className="title">Trust, fit, and festive polish.</h2>
          </div>
        </div>
        <div className={styles.testimonials}>
          {testimonials.map((quote) => (
            <blockquote key={quote}>{quote}</blockquote>
          ))}
        </div>
      </section>

      <section className={styles.instagram}>
        <p className="eyebrow">Instagram</p>
        <h2>Follow the latest drops @poonamattire</h2>
        <Link className="button" href="https://www.instagram.com/poonamattire/">
          Open Instagram
        </Link>
      </section>
    </main>
  );
}
