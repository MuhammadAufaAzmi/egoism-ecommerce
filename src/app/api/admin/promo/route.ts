import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  if (!userId) return false;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  return user?.role === "ADMIN";
}

// GET — list all promo codes
export async function GET() {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false }, { status: 401 });

  const promos = await prisma.promoCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, promos });
}

// POST — create promo code
export async function POST(req: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const body = await req.json();
    const { code, discountType, discountValue, minOrder, maxUses, expiresAt, isActive } = body;

    if (!code || !discountType || !discountValue) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap." });
    }

    // Check duplicate
    const existing = await prisma.promoCode.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json({ success: false, message: "Kode promo sudah ada." });
    }

    await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrder: Number(minOrder) || 0,
        maxUses: Number(maxUses) || 0,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create promo error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." });
  }
}

// PATCH — toggle active
export async function PATCH(req: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const { id, isActive } = await req.json();
    await prisma.promoCode.update({ where: { id }, data: { isActive } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}

// DELETE — remove promo code
export async function DELETE(req: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false });

  try {
    await prisma.promoCode.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
