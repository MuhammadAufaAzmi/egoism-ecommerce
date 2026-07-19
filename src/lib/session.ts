import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

function getSecretKey() {
  const secretKey = process.env.SESSION_SECRET || process.env.SUPABASE_URL || process.env.CLOUDINARY_API_SECRET;
  if (!secretKey) {
    throw new Error("FATAL: SESSION_SECRET environment variable is not set. Cannot sign/verify JWT tokens.");
  }
  return new TextEncoder().encode(secretKey);
}

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d") // Sesi berlaku 30 hari
    .sign(getSecretKey());
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string, role: string) {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 hari
  const session = await encrypt({ userId, role, expires });

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  
  // Hapus cookie rentan yang lama
  cookieStore.delete("user_id");
  cookieStore.delete("user_role");
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("user_id");
  cookieStore.delete("user_role");
}
