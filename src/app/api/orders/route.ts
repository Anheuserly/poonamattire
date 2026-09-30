import { NextResponse } from "next/server";
import { query, getClient } from "@/lib/db";
import { getAuthenticatedUser, verifyApiKey } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");
    const user = getAuthenticatedUser(req);
    const keyCheck = await verifyApiKey(apiKey, "orders:read");

    if (!keyCheck.valid && !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let sql = `
      SELECT o.id, o.order_number, o.user_id, o.customer_name, o.customer_email,
             o.customer_phone, o.shipping_address, o.city, o.state, o.postal_code,
             o.subtotal, o.discount, o.total_amount, o.payment_method, o.payment_status,
             o.order_status, o.notes, o.created_at, o.updated_at,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', oi.id,
                   'productId', oi.product_id,
                   'productName', oi.product_name,
                   'name', oi.product_name,
                   'size', oi.size,
                   'price', oi.price,
                   'quantity', oi.quantity,
                   'imageUrl', COALESCE(oi.image_url, p.image),
                   'image', COALESCE(oi.image_url, p.image)
                 )
               ) FILTER (WHERE oi.id IS NOT NULL), '[]'
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
    `;
    const params: any[] = [];

    // If user is not admin and is authenticated, show only their orders
    if (user && user.role !== "admin") {
      params.push(user.id);
      sql += ` WHERE o.user_id = $${params.length}`;
    } else {
      sql += ` WHERE 1=1`;
    }

    if (status && status !== "all") {
      params.push(status);
      sql += ` AND o.order_status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(o.order_number) LIKE $${params.length} OR LOWER(o.customer_name) LIKE $${params.length} OR LOWER(o.customer_email) LIKE $${params.length} OR o.customer_phone LIKE $${params.length})`;
    }

    sql += ` GROUP BY o.id ORDER BY o.created_at DESC`;

    const res = await query(sql, params);

    const orders = res.rows.map((r) => ({
      ...r,
      subtotal: Number(r.subtotal),
      discount: Number(r.discount),
      totalAmount: Number(r.total_amount),
      total_amount: Number(r.total_amount),
      orderNumber: r.order_number,
      order_number: r.order_number,
      customerName: r.customer_name,
      customer_name: r.customer_name,
      customerEmail: r.customer_email,
      customer_email: r.customer_email,
      customerPhone: r.customer_phone,
      customer_phone: r.customer_phone,
      shippingAddress: r.shipping_address,
      shipping_address: r.shipping_address,
      postalCode: r.postal_code,
      postal_code: r.postal_code,
      paymentMethod: r.payment_method || "cod",
      payment_method: r.payment_method || "cod",
      paymentStatus: r.payment_status || "pending",
      payment_status: r.payment_status || "pending",
      orderStatus: r.order_status || "confirmed",
      order_status: r.order_status || "confirmed",
      createdAt: r.created_at,
      created_at: r.created_at,
      items: r.items || [],
    }));

    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const client = await getClient();
  try {
    const apiKey = req.headers.get("x-api-key");
    const user = getAuthenticatedUser(req);
    const keyCheck = await verifyApiKey(apiKey, "orders:create");

    if (!keyCheck.valid && !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      state,
      postalCode,
      paymentMethod = "cod",
      notes = "",
      items = [],
      discount = 0,
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !city || !state || !postalCode) {
      return NextResponse.json(
        { success: false, error: "Complete contact and shipping address details are required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order must contain at least one item." },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `PA-2026-${randomSeq}`;

    let subtotal = 0;
    for (const item of items) {
      subtotal += Number(item.price) * Number(item.quantity);
    }
    const totalAmount = Math.max(0, subtotal - Number(discount));
    const userId = user ? user.id : body.userId || null;

    // Insert Order
    await client.query(
      `INSERT INTO orders (
        id, order_number, user_id, customer_name, customer_email, customer_phone,
        shipping_address, city, state, postal_code, subtotal, discount, total_amount,
        payment_method, payment_status, order_status, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'confirmed', $16)`,
      [
        orderId,
        orderNumber,
        userId,
        customerName.trim(),
        customerEmail.trim().toLowerCase(),
        customerPhone.trim(),
        shippingAddress.trim(),
        city.trim(),
        state.trim(),
        postalCode.trim(),
        subtotal,
        discount,
        totalAmount,
        paymentMethod,
        paymentMethod === "cod" ? "pending" : "paid",
        notes,
      ]
    );

    // Insert Order Items and adjust stock
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, size, price, quantity, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          orderId,
          item.productId || item.id,
          item.productName || item.name,
          item.size || "M",
          Number(item.price),
          Number(item.quantity),
          item.imageUrl || item.image || null,
        ]
      );

      // Decrement stock
      if (item.productId || item.id) {
        await client.query(
          `UPDATE products SET stock = GREATEST(0, stock - $1) WHERE id = $2`,
          [Number(item.quantity), item.productId || item.id]
        );
      }
    }

    // Clear user's cart if registered
    if (userId) {
      await client.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);
    }

    await client.query("COMMIT");

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully.",
        order: {
          id: orderId,
          orderNumber,
          totalAmount,
          customerName,
          orderStatus: "confirmed",
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to place order." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
