import { query } from "./db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "poonam_attire_default_secret_key_2026";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: "customer" | "staff" | "admin";
};

// --- Password utilities ---
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// --- Lightweight Secure Token Sign/Verify ---
export function signToken(payload: AuthUser, expiresInSec = 60 * 60 * 24 * 7): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const exp = Math.floor(Date.now() / 1000) + expiresInSec;
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");
    if (signature !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;

    return {
      id: payload.id,
      email: payload.email,
      fullName: payload.fullName,
      phone: payload.phone,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

// --- API Key & Scope Verification ---
export async function verifyApiKey(
  apiKeyHeader: string | null,
  requiredScope?: string
): Promise<{ valid: boolean; name?: string; scopes?: string[]; error?: string }> {
  if (!apiKeyHeader) {
    return { valid: false, error: "Missing x-api-key header" };
  }

  try {
    const result = await query(
      `SELECT k.id, k.name, k.is_active, k.expires_at, 
              COALESCE(array_agg(s.scope) FILTER (WHERE s.scope IS NOT NULL), '{}') as scopes
       FROM project_api_keys k
       LEFT JOIN project_api_key_scopes s ON k.id = s.api_key_id
       WHERE k.key_hash = $1
       GROUP BY k.id, k.name, k.is_active, k.expires_at`,
      [apiKeyHeader]
    );

    if (result.rowCount === 0) {
      return { valid: false, error: "Invalid API key" };
    }

    const key = result.rows[0];
    if (!key.is_active) {
      return { valid: false, error: "API key is deactivated" };
    }

    if (key.expires_at && new Date(key.expires_at) < new Date()) {
      return { valid: false, error: "API key has expired" };
    }

    const scopes: string[] = key.scopes || [];
    if (requiredScope) {
      const hasScope = scopes.includes("admin:all") || scopes.includes(requiredScope);
      if (!hasScope) {
        return { valid: false, error: `Missing required scope: ${requiredScope}`, scopes };
      }
    }

    return { valid: true, name: key.name, scopes };
  } catch (error) {
    console.error("verifyApiKey error:", error);
    return { valid: false, error: "Database error during key verification" };
  }
}

// Helper to extract bearer token or user from Request
export function getAuthenticatedUser(req: Request): AuthUser | null {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7).trim();
  return verifyToken(token);
}
