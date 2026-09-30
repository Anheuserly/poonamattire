import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthenticatedUser, verifyApiKey } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const res = await query(
      `SELECT id, slug, name, category, fabric, color, price, mrp, rating,
              reviews_count as reviews, sizes, image, gallery, description,
              tags, stock, is_featured, is_active, created_at
       FROM products
       WHERE slug = $1 OR id = $1`,
      [slug]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const row = res.rows[0];
    const product = {
      ...row,
      price: Number(row.price),
      mrp: Number(row.mrp),
      rating: Number(row.rating),
      reviews: Number(row.reviews),
    };

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Product GET error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const apiKey = req.headers.get("x-api-key");
    const user = getAuthenticatedUser(req);
    const keyCheck = await verifyApiKey(apiKey, "catalog:write");

    if (!keyCheck.valid && (!user || user.role !== "admin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    await query("DELETE FROM products WHERE slug = $1 OR id = $1", [slug]);

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error: any) {
    console.error("Product DELETE error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
