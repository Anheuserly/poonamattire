import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword, signToken, verifyApiKey } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");
    const keyCheck = await verifyApiKey(apiKey);
    if (!keyCheck.valid) {
      return NextResponse.json({ success: false, error: keyCheck.error }, { status: 401 });
    }

    const body = await req.json();
    const { email, password, fullName, phone } = body;

    if (!email || !password || !fullName || !phone) {
      return NextResponse.json(
        { success: false, error: "Email, password, full name, and phone number are all required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanName = fullName.trim();

    // Check if user already exists
    const existing = await query("SELECT id FROM users WHERE email = $1", [cleanEmail]);
    if (existing.rowCount && existing.rowCount > 0) {
      return NextResponse.json(
        { success: false, error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    await query(
      `INSERT INTO users (id, email, password_hash, full_name, phone, role)
       VALUES ($1, $2, $3, $4, $5, 'customer')`,
      [userId, cleanEmail, passwordHash, cleanName, cleanPhone]
    );

    const user = {
      id: userId,
      email: cleanEmail,
      fullName: cleanName,
      phone: cleanPhone,
      role: "customer" as const,
    };

    const token = signToken(user);

    return NextResponse.json(
      {
        success: true,
        message: "Account registered successfully.",
        user,
        token,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to register account." },
      { status: 500 }
    );
  }
}
