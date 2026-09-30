import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthenticatedUser, verifyApiKey } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await query(
      `SELECT o.*, 
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', oi.id,
                    'productId', oi.product_id,
                    'productName', oi.product_name,
                    'size', oi.size,
                    'price', oi.price,
                    'quantity', oi.quantity,
                    'imageUrl', oi.image_url
                  )
                ) FILTER (WHERE oi.id IS NOT NULL), '[]'
              ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.id = $1 OR o.order_number = $1
       GROUP BY o.id`,
      [id]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const row = res.rows[0];
    return NextResponse.json({
      success: true,
      order: {
        ...row,
        subtotal: Number(row.subtotal),
        discount: Number(row.discount),
        totalAmount: Number(row.total_amount),
        orderNumber: row.order_number,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        customerPhone: row.customer_phone,
        orderStatus: row.order_status,
      },
    });
  } catch (error: any) {
    console.error("Order GET error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const apiKey = req.headers.get("x-api-key");
    const user = getAuthenticatedUser(req);
    const keyCheck = await verifyApiKey(apiKey, "orders:write");

    if (!keyCheck.valid && (!user || user.role !== "admin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { orderStatus, paymentStatus, notes } = body;

    const updates: string[] = [];
    const values: any[] = [];

    if (orderStatus) {
      values.push(orderStatus);
      updates.push(`order_status = $${values.length}`);
    }

    if (paymentStatus) {
      values.push(paymentStatus);
      updates.push(`payment_status = $${values.length}`);
    }

    if (notes !== undefined) {
      values.push(notes);
      updates.push(`notes = $${values.length}`);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: "No fields to update." }, { status: 400 });
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    const sql = `UPDATE orders SET ${updates.join(", ")} WHERE id = $${values.length} OR order_number = $${values.length} RETURNING *`;
    const res = await query(sql, values);

    if (res.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }

    // Record audit log
    await query(
      `INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, details)
       VALUES ($1, 'order.update_status', 'order', $2, $3)`,
      [user ? user.id : "system_key", id, JSON.stringify({ orderStatus, paymentStatus })]
    ).catch(() => {});

    return NextResponse.json({
      success: true,
      message: "Order updated successfully.",
      order: res.rows[0],
    });
  } catch (error: any) {
    console.error("Order PATCH error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
