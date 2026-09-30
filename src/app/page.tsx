import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gem, Search, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { collections, products as staticProducts } from "@/data/products";
import { ProductGrid } from "@/components/ProductGrid";
import { StyleConcierge } from "@/components/StyleConcierge";
import { YoutubeIcon, InstagramIcon, FacebookIcon } from "@/components/SocialIcons";
import { query } from "@/lib/db";
import styles from "./home.module.css";

const testimonials = [
  "The fabric felt premium and the fitting was exactly right for Diwali.",
  "Beautiful packaging, quick delivery, and the maroon suit looked even better in person.",
  "Elegant styles without the heavy boutique price. I keep coming back.",
];

export default async function Home() {
  let liveProducts: any[] = [];
  try {
    const res = await query(
      `SELECT id, slug, name, category, fabric, color, price, mrp, rating,
              reviews_count as reviews, sizes, image, gallery, description,
              tags, stock, sku, brand
       FROM products
       WHERE is_active = TRUE
       ORDER BY is_featured DESC, created_at DESC
       LIMIT 6`
    );
    if (res.rowCount && res.rowCount > 0) {
      liveProducts = res.rows.map((r) => ({
        ...r,
        price: Number(r.price),
        mrp: Number(r.mrp),
        rating: Number(r.rating),
        reviews: Number(r.reviews),
        sizes: r.sizes || ["XS", "S", "M", "L", "XL"],
        gallery: r.gallery && r.gallery.length > 0 ? r.gallery : [r.image],
        tags: r.tags || [],
      }));
    }
  } catch {}

  const displayProducts = liveProducts.length > 0 ? liveProducts : staticProducts;

  // Google Search Store & ItemList Rich Result Schema
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Store",
        "@id": "https://poonamattire.com/#store",
        "name": "Poonam Attire",
        "image": "https://poonamattire.com/poonam-attire-logo.jpg",
        "url": "https://poonamattire.com",
        "telephone": "+91-98100-12345",
        "priceRange": "₹₹",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Boutique Atelier, Linking Road",
          "addressLocality": "Mumbai",
          "addressRegion": "Maharashtra",
          "postalCode": "400050",
          "addressCountry": "IN",
        },
        "sameAs": [
          "https://www.youtube.com/@PoonamsAttire06",
          "https://www.instagram.com/poonamsattire06/",
          "https://www.facebook.com/poonamsattire06/"
        ],
      },
      {
        "@type": "ItemList",
        "name": "Poonam Attire Featured Festive & Wedding Wear",
        "numberOfItems": displayProducts.length,
        "itemListElement": displayProducts.map((p, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "item": {
            "@type": "Product",
            "name": p.name,
            "url": `https://poonamattire.com/product/${p.slug}`,
            "image": p.image,
            "description": p.description,
            "offers": {
              "@type": "Offer",
              "price": p.price,
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock",
            },
          },
        })),
      },
    ],
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
          <form className={styles.heroFinder} action="/shop" method="GET">
            <Search size={19} />
            <input name="search" aria-label="Search outfits" placeholder="Search cotton, festive, maroon, wedding..." />
            <button type="submit" style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontWeight: 600 }}>
              Find outfit
            </button>
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
              width={140}
              height={140}
              priority
            />
            <span>Lotus boutique edit</span>
          </div>
          <div className={styles.fabricBoard}>
            <span />
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
            {["Festive", "Wedding", "Occasion", "Workwear"].map((item) => (
              <Link href={`/shop?category=${item}`} key={item}>
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
        <ProductGrid products={displayProducts.slice(0, 3)} />
      </section>

      <section className={`${styles.storyBand} section`}>
        <div>
          <p className="eyebrow">Category highlights</p>
          <h2 className="title">From cotton workwear to wedding guest shimmer.</h2>
        </div>
        <div className={styles.storyGrid}>
          <article>
            <h3>Festive Salwar Sets</h3>
            <p>Rich palettes, fine zari margins, and celebratory dupattas.</p>
            <Link href="/shop?category=Festive">Shop festive</Link>
          </article>
          <article>
            <h3>Wedding Guest Edit</h3>
            <p>Elevated Anarkalis and Chanderi sets with regal presence.</p>
            <Link href="/shop?category=Wedding">Shop wedding</Link>
          </article>
          <article>
            <h3>Everyday Handlooms</h3>
            <p>Pure breathable cottons and linens tailored for fluid motion.</p>
            <Link href="/shop?category=Casual">Shop cotton</Link>
          </article>
        </div>
      </section>

      <section className={`${styles.socialSpotlight} section`}>
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Atelier In Motion</p>
            <h2 className="title">Watch our craft on YouTube &amp; Socials.</h2>
          </div>
          <a
            className="buttonSecondary"
            href="https://www.youtube.com/@PoonamsAttire06"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit YouTube Channel &rarr;
          </a>
        </div>

        <div className={styles.socialSpotlightGrid}>
          {/* YouTube Feature Card */}
          <article className={styles.spotlightCard}>
            <div className={styles.spotlightIconBadge} style={{ background: "#ff0000", color: "#fff" }}>
              <YoutubeIcon size={24} />
            </div>
            <span className={styles.spotlightPlatform}>Official YouTube</span>
            <h3>@PoonamsAttire06</h3>
            <p>
              Step inside our boutique atelier. Watch festive salwar drape tutorials, pure silk luster showcases, and detailed sizing breakdowns.
            </p>
            <a
              href="https://www.youtube.com/@PoonamsAttire06"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.spotlightLink}
            >
              Watch Latest Videos &rarr;
            </a>
          </article>

          {/* Instagram Feature Card */}
          <article className={styles.spotlightCard}>
            <div className={styles.spotlightIconBadge} style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", color: "#fff" }}>
              <InstagramIcon size={22} color="#fff" />
            </div>
            <span className={styles.spotlightPlatform}>Instagram Reels</span>
            <h3>@poonamsattire06</h3>
            <p>
              Daily arrivals, real customer trials, festive styling inspiration, and behind-the-scenes glimpses into our handloom weaving artisans.
            </p>
            <a
              href="https://www.instagram.com/poonamsattire06/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.spotlightLink}
            >
              Follow on Instagram &rarr;
            </a>
          </article>

          {/* Facebook Feature Card */}
          <article className={styles.spotlightCard}>
            <div className={styles.spotlightIconBadge} style={{ background: "#1877f2", color: "#fff" }}>
              <FacebookIcon size={22} color="#fff" />
            </div>
            <span className={styles.spotlightPlatform}>Facebook Community</span>
            <h3>Poonam Attire Boutique</h3>
            <p>
              Join our growing circle of ethnic fashion connoisseurs. Discover seasonal exhibitions, private trunk shows, and customer stories.
            </p>
            <a
              href="https://www.facebook.com/poonamsattire06/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.spotlightLink}
            >
              Join on Facebook &rarr;
            </a>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Customer reviews</p>
            <h2 className="title">Loved across celebrations.</h2>
          </div>
        </div>
        <div className={styles.testimonials}>
          {testimonials.map((quote) => (
            <article key={quote}>
              <p>&ldquo;{quote}&rdquo;</p>
              <span>Verified Boutique Shopper</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
