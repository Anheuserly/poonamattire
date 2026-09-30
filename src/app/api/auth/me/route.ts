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
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userRes = await query(
      `SELECT id, email, full_name, phone, role, created_at 
       FROM users WHERE id = $1 AND is_active = TRUE`,
      [auth.id]
    );

    if (userRes.rowCount === 0) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const ordersRes = await query(
      `SELECT id, order_number, total_amount, order_status, payment_status, created_at
       FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10`,
      [auth.id]
    );

    return NextResponse.json({
      success: true,
      user: userRes.rows[0],
      orders: ordersRes.rows,
    });
  } catch (error: any) {
    console.error("Auth me error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
