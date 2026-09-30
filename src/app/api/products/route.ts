import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthenticatedUser, verifyApiKey } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    let sql = `
      SELECT id, slug, name, category, fabric, color, price, mrp, rating, 
             reviews_count as reviews, sizes, image, gallery, description, 
             tags, stock, is_featured, is_active, created_at
      FROM products
      WHERE is_active = TRUE
    `;
    const params: any[] = [];

    if (category && category !== "All") {
      params.push(category);
      sql += ` AND LOWER(category) = LOWER($${params.length})`;
    }

    if (featured === "true") {
      sql += ` AND is_featured = TRUE`;
    }

    if (search) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(description) LIKE $${params.length} OR LOWER(fabric) LIKE $${params.length})`;
    }

    sql += ` ORDER BY display_order ASC, created_at DESC`;

    // Note: if display_order doesn't exist on products table, we fall back to created_at
    let res;
    try {
      res = await query(sql, params);
    } catch {
      // Fallback query if display_order is omitted
      sql = sql.replace("display_order ASC, ", "");
      res = await query(sql, params);
    }

    // Convert numeric strings to numbers
    const products = res.rows.map((r) => ({
      ...r,
      price: Number(r.price),
      mrp: Number(r.mrp),
      rating: Number(r.rating),
      reviews: Number(r.reviews),
    }));

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error: any) {
    console.error("Products GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load products." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");
    const user = getAuthenticatedUser(req);
    const keyCheck = await verifyApiKey(apiKey, "catalog:write");

    if (!keyCheck.valid && (!user || user.role !== "admin")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin privileges or catalog:write scope required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      category,
      fabric,
      color,
      price,
      mrp,
      sizes,
      image,
      gallery,
      description,
      tags,
      stock,
    } = body;

    if (!name || !category || !fabric || !color || !price) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (name, category, fabric, color, price)." },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const id = body.id || `pa-${Date.now().toString(36)}`;
    const parsedPrice = Number(price);
    const parsedMrp = Number(mrp || price);
    const parsedStock = Number(stock || 50);
    const sizeList = Array.isArray(sizes) && sizes.length > 0 ? sizes : ["XS", "S", "M", "L", "XL"];
    const tagList = Array.isArray(tags) ? tags : ["New"];
    const galleryList = Array.isArray(gallery) && gallery.length > 0 ? gallery : [image];

    await query(
      `INSERT INTO products (
        id, slug, name, category, fabric, color, price, mrp, 
        sizes, image, gallery, description, tags, stock, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, TRUE)
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        fabric = EXCLUDED.fabric,
        color = EXCLUDED.color,
        price = EXCLUDED.price,
        mrp = EXCLUDED.mrp,
        sizes = EXCLUDED.sizes,
        image = EXCLUDED.image,
        gallery = EXCLUDED.gallery,
        description = EXCLUDED.description,
        tags = EXCLUDED.tags,
        stock = EXCLUDED.stock`,
      [
        id,
        slug,
        name,
        category,
        fabric,
        color,
        parsedPrice,
        parsedMrp,
        sizeList,
        image || "https://images.unsplash.com/photo-1594226801341-41427b4e5c22?auto=format&fit=crop&w=900&q=80",
        galleryList,
        description || `${name} in fine ${fabric}.`,
        tagList,
        parsedStock,
      ]
    );

    // Also insert image into product_images
    if (image) {
      await query(
        `INSERT INTO product_images (product_id, image_url, is_primary) 
         VALUES ($1, $2, TRUE)`,
        [id, image]
      ).catch(() => {});
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully.",
        product: { id, slug, name, category, fabric, color, price: parsedPrice, mrp: parsedMrp },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Products POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product." },
      { status: 500 }
    );
  }
}
