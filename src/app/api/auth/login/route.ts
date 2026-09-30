import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { comparePassword, signToken, verifyApiKey } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");
    const keyCheck = await verifyApiKey(apiKey);
    if (!keyCheck.valid) {
      return NextResponse.json({ success: false, error: keyCheck.error }, { status: 401 });
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const res = await query(
      `SELECT id, email, password_hash, full_name, phone, role, is_active 
       FROM users WHERE email = $1`,
      [cleanEmail]
    );

    if (res.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const userRecord = res.rows[0];
    if (!userRecord.is_active) {
      return NextResponse.json(
        { success: false, error: "This account has been deactivated." },
        { status: 403 }
      );
    }

    const isMatch = await comparePassword(password, userRecord.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const user = {
      id: userRecord.id,
      email: userRecord.email,
      fullName: userRecord.full_name,
      phone: userRecord.phone,
      role: userRecord.role,
    };

    const token = signToken(user);

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      user,
      token,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to log in." },
      { status: 500 }
    );
  }
}
