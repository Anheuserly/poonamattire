import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthenticatedUser, verifyApiKey } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");
    const user = getAuthenticatedUser(req);
    const keyCheck = await verifyApiKey(apiKey, "admin:all");

    if (!keyCheck.valid && (!user || user.role !== "admin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    // Products Count
    const prodRes = await query("SELECT count(*) as total, count(*) FILTER (WHERE stock < 10) as low_stock FROM products WHERE is_active = TRUE");

    // Orders Count
    const orderRes = await query(`
      SELECT 
        count(*) as total_orders,
        count(*) FILTER (WHERE order_status IN ('confirmed', 'processing')) as open_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue
      FROM orders
    `);

    // Recent 10 Orders
    const recentOrders = await query(`
      SELECT id, order_number, customer_name, customer_email, customer_phone,
             total_amount, order_status, payment_status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 10
    `);

    // Inventory sample
    const inventory = await query(`
      SELECT id, slug, name, category, fabric, color, price, stock, is_active
      FROM products
      ORDER BY created_at DESC
      LIMIT 20
    `);

    return NextResponse.json({
      success: true,
      stats: {
        productsCount: Number(prodRes.rows[0].total),
        lowStockCount: Number(prodRes.rows[0].low_stock),
        openOrdersCount: Number(orderRes.rows[0].open_orders),
        totalOrdersCount: Number(orderRes.rows[0].total_orders),
        totalRevenue: Number(orderRes.rows[0].total_revenue),
        conversionHealth: "94%",
      },
      recentOrders: recentOrders.rows,
      inventory: inventory.rows,
    });
  } catch (error: any) {
    console.error("Admin overview error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
