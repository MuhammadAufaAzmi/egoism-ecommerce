import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// --- MEMORY-BASED RATE LIMITER ---
// Menyimpan jumlah request per IP.
// Catatan: Karena Vercel menggunakan infrastruktur Serverless/Edge, Map ini mungkin akan reset
// per-instance atau per-lokasi Edge. Tapi cukup efektif untuk menangkal spam basic dari 1 koneksi.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 100; // maksimal 100 request
const WINDOW_MS = 60 * 1000; // per 1 menit

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now - record.lastReset > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true; // allow
  }
  if (record.count >= RATE_LIMIT) {
    return false; // reject
  }
  record.count += 1;
  return true;
}

// --- MIDDLEWARE ---
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  // 1. Terapkan Rate Limiting pada API endpoints
  if (pathname.startsWith("/api/")) {
    const allowed = checkRateLimit(ip);
    if (!allowed) {
      return new NextResponse("Terlalu banyak permintaan (Rate Limit Exceeded). Silakan coba lagi nanti.", { status: 429 });
    }
  }

  // 2. Proteksi Route Admin dengan JWT
  if (pathname.startsWith("/admin")) {
    const sessionToken = request.cookies.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const secretKey = process.env.SESSION_SECRET;
      if (!secretKey) {
        console.error("FATAL: SESSION_SECRET not set");
        return NextResponse.redirect(new URL("/login", request.url));
      }
      const key = new TextEncoder().encode(secretKey);
      
      const { payload } = await jwtVerify(sessionToken, key, {
        algorithms: ["HS256"],
      });

      // Verifikasi Role secara Kriptografis langsung dari payload JWT!
      if (payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      // Jika token tidak valid / dimanipulasi / expired
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};

