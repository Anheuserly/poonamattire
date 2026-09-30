import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthenticatedUser, verifyApiKey } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");
    const keyCheck = await verifyApiKey(apiKey);
    if (!keyCheck.valid) {
      return NextResponse.json({ success: false, error: keyCheck.error }, { status: 401 });
    }

    const auth = getAuthenticatedUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    const res = await query(
      `SELECT c.id, c.size, c.quantity, c.created_at,
              p.id as product_id, p.slug, p.name, p.category, p.fabric, p.color,
              p.price, p.mrp, p.image, p.sizes
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC`,
      [auth.id]
    );

    const items = res.rows.map((row) => ({
      id: row.id,
      size: row.size,
      quantity: Number(row.quantity),
      product: {
        id: row.product_id,
        slug: row.slug,
        name: row.name,
        category: row.category,
        fabric: row.fabric,
        color: row.color,
        price: Number(row.price),
        mrp: Number(row.mrp),
        image: row.image,
        sizes: row.sizes,
      },
    }));

    return NextResponse.json({ success: true, cart: items });
  } catch (error: any) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");
    const keyCheck = await verifyApiKey(apiKey);
    if (!keyCheck.valid) {
      return NextResponse.json({ success: false, error: keyCheck.error }, { status: 401 });
    }

    const auth = getAuthenticatedUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, size, quantity = 1 } = body;

    if (!productId || !size) {
      return NextResponse.json({ success: false, error: "Product ID and size are required" }, { status: 400 });
    }

    await query(
      `INSERT INTO cart_items (user_id, product_id, size, quantity)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, product_id, size)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity, updated_at = CURRENT_TIMESTAMP`,
      [auth.id, productId, size, quantity]
    );

    return NextResponse.json({ success: true, message: "Item added to cart." });
  } catch (error: any) {
    console.error("Cart POST error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");
    const keyCheck = await verifyApiKey(apiKey);
    if (!keyCheck.valid) {
      return NextResponse.json({ success: false, error: keyCheck.error }, { status: 401 });
    }

    const auth = getAuthenticatedUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const size = searchParams.get("size");

    if (productId && size) {
      await query("DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 AND size = $3", [
        auth.id,
        productId,
        size,
      ]);
    } else {
      await query("DELETE FROM cart_items WHERE user_id = $1", [auth.id]);
    }

    return NextResponse.json({ success: true, message: "Cart updated." });
  } catch (error: any) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
