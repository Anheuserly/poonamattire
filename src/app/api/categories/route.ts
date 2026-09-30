import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const res = await query(
      `SELECT id, slug, name, copy, image_url as image, display_order, is_active
       FROM categories
       WHERE is_active = TRUE
       ORDER BY display_order ASC`
    );

    return NextResponse.json({
      success: true,
      categories: res.rows,
    });
  } catch (error: any) {
    console.error("Categories GET error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
