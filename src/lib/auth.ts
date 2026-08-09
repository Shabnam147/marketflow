import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// jose is used (instead of jsonwebtoken) because it works in both the
// Node.js API routes AND the Edge middleware runtime, which is where
// jsonwebtoken's reliance on Node's `crypto` module would otherwise break.

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export const COOKIE_NAME = process.env.COOKIE_NAME || "marketflow_session";

function getSecretKey() {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is missing from environment variables.");
  return new TextEncoder().encode(JWT_SECRET);
}

export type JWTPayload = {
  userId: string;
  role: "client" | "admin" | "employee";
  email: string;
};

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: JWTPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(getSecretKey());
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

/** Reads and verifies the session cookie inside a server component / route handler. */
export async function getSessionFromCookies(): Promise<JWTPayload | null> {
  const store = cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};
