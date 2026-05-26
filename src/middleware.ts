import { NextRequest, NextResponse } from "next/server";

// Middleware untuk proteksi route admin
// Berjalan di edge runtime — dicek di server, tidak bisa dimanipulasi browser
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Hanya proteksi route admin
  if (pathname.startsWith("/admin")) {
    const userId = request.cookies.get("user_id")?.value;

    // Tidak login → redirect ke login
    if (!userId) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verifikasi role langsung dari database via internal API
    try {
      const verifyUrl = new URL("/api/auth/verify-admin", request.url);
      verifyUrl.searchParams.set("userId", userId);

      const res = await fetch(verifyUrl.toString(), {
        headers: { "x-middleware-secret": process.env.INTERNAL_API_SECRET || "fallback-secret" },
      });

      const data = await res.json();

      if (!data.isAdmin) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      // Kalau gagal verifikasi (DB down dll), tolak akses
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
