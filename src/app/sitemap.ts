import { MetadataRoute } from "next";
import { query } from "@/lib/db";
import { products } from "@/data/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://poonamattire.com";

  let productSlugs: string[] = products.map((p) => p.slug);
  try {
    const res = await query("SELECT slug, updated_at FROM products WHERE is_active = TRUE");
    if (res.rowCount && res.rowCount > 0) {
      productSlugs = res.rows.map((r) => r.slug);
    }
  } catch {}

  const productUrls: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${baseUrl}/product/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.8,
    },
  ];

  return [...staticUrls, ...productUrls];
}
