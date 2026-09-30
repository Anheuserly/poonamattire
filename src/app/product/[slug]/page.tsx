import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { ProductGrid } from "@/components/ProductGrid";
import { getProduct, products } from "@/data/products";
import { query } from "@/lib/db";
import Script from "next/script";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  try {
    const res = await query("SELECT slug FROM products WHERE is_active = TRUE");
    if (res.rowCount && res.rowCount > 0) {
      return res.rows.map((r) => ({ slug: r.slug }));
    }
  } catch {}
  return products.map((product) => ({ slug: product.slug }));
}

async function fetchProduct(slug: string) {
  try {
    const res = await query(
      `SELECT id, slug, name, category, fabric, color, price, mrp, rating,
              reviews_count as reviews, sizes, image, gallery, description,
              tags, stock, sku, brand, availability, meta_title, meta_description
       FROM products
       WHERE slug = $1 OR id = $1`,
      [slug]
    );
    if (res.rowCount && res.rowCount > 0) {
      const r = res.rows[0];
      return {
        ...r,
        price: Number(r.price),
        mrp: Number(r.mrp),
        rating: Number(r.rating),
        reviews: Number(r.reviews),
        sizes: r.sizes || ["XS", "S", "M", "L", "XL"],
        gallery: r.gallery && r.gallery.length > 0 ? r.gallery : [r.image],
        tags: r.tags || [],
      };
    }
  } catch {}
  return getProduct(slug);
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return { title: "Product Not Found | Poonam Attire" };
  }

  const title = product.meta_title || `${product.name} | Luxury Indian Wear | Poonam Attire`;
  const description =
    product.meta_description ||
    `${product.name} in fine ${product.fabric}. Buy authentic handcrafted ethnic wear with free shipping & COD.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://poonamattire.com/product/${product.slug}`,
      siteName: "Poonam Attire Boutique",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: product.image,
          width: 900,
          height: 1200,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
    alternates: {
      canonical: `https://poonamattire.com/product/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    notFound();
  }

  // Related products
  let related: any[] = [];
  try {
    const relRes = await query(
      `SELECT id, slug, name, category, fabric, color, price, mrp, rating,
              reviews_count as reviews, sizes, image, gallery, description, tags, stock
       FROM products
       WHERE id != $1 AND is_active = TRUE
       ORDER BY (category = $2) DESC, created_at DESC
       LIMIT 3`,
      [product.id, product.category]
    );
    if (relRes.rowCount && relRes.rowCount > 0) {
      related = relRes.rows.map((r) => ({
        ...r,
        price: Number(r.price),
        mrp: Number(r.mrp),
        rating: Number(r.rating),
        reviews: Number(r.reviews),
      }));
    }
  } catch {}

  if (related.length === 0) {
    related = products.filter((item) => item.id !== product.id).slice(0, 3);
  }

  // Google Search Card (Product Schema.org JSON-LD)
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.gallery && product.gallery.length > 0 ? product.gallery : [product.image],
    "description": product.description,
    "sku": product.sku || `PA-${product.id.toUpperCase()}`,
    "mpn": product.id,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Poonam Attire",
    },
    "color": product.color,
    "category": product.category,
    "material": product.fabric,
    "offers": {
      "@type": "Offer",
      "url": `https://poonamattire.com/product/${product.slug}`,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability":
        (product.stock ?? 10) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Poonam Attire",
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "IN",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 7,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn",
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": 0,
          "currency": "INR",
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "IN",
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "businessDays": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "https://schema.org/Monday",
              "https://schema.org/Tuesday",
              "https://schema.org/Wednesday",
              "https://schema.org/Thursday",
              "https://schema.org/Friday",
              "https://schema.org/Saturday",
            ],
          },
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY",
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 2,
            "maxValue": 4,
            "unitCode": "DAY",
          },
        },
      },
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || 4.8,
      "reviewCount": product.reviews || 88,
      "bestRating": "5",
      "worstRating": "1",
    },
  };

  // Breadcrumbs Schema for Google Search Cards
  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://poonamattire.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": product.category,
        "item": `https://poonamattire.com/shop?category=${encodeURIComponent(product.category)}`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `https://poonamattire.com/product/${product.slug}`,
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <ProductDetailClient product={product} />
      <section className="section">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Handcrafted Ensemble Recommendations</p>
            <h2 className="title">Complete your boutique look.</h2>
          </div>
        </div>
        <ProductGrid products={related} />
      </section>
    </main>
  );
}
