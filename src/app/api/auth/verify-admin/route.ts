import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Internal API untuk verifikasi admin — hanya dipanggil oleh middleware
export async function GET(req: NextRequest) {
  // Hanya terima request dari middleware internal
  const secret = req.headers.get("x-middleware-secret");
  const expectedSecret = process.env.INTERNAL_API_SECRET;
  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ isAdmin: false }, { status: 403 });
  }

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ isAdmin: false });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return NextResponse.json({ isAdmin: user?.role === "ADMIN" });
  } catch {
    return NextResponse.json({ isAdmin: false });
  }
}
