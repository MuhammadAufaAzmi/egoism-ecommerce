import { getSession, clearSession, createSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function verifyAdmin() {
  const session = await getSession();
  const userId = session?.userId;
  if (!userId) return false;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  return user?.role === "ADMIN";
}

// POST — create new shipping zone
export async function POST(req: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const { zone, province, cost, etd } = await req.json();

    if (!zone || !province || cost === undefined || !etd) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap." });
    }

    // Check duplicate province
    const existing = await (prisma as any).shippingZone.findUnique({ where: { province } });
    if (existing) {
      return NextResponse.json({ success: false, message: "Provinsi sudah terdaftar." });
    }

    await (prisma as any).shippingZone.create({
      data: { zone, province, cost: Number(cost), etd },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create shipping zone error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." });
  }
}

// PATCH — update shipping zone
export async function PATCH(req: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const { id, zone, province, cost, etd } = await req.json();

    if (!id || !zone || !province || cost === undefined || !etd) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap." });
    }

    await (prisma as any).shippingZone.update({
      where: { id },
      data: { zone, province, cost: Number(cost), etd },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update shipping zone error:", error);
    return NextResponse.json({ success: false, message: "Gagal update zona." });
  }
}

// DELETE — remove shipping zone
export async function DELETE(req: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ success: false }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, message: "ID tidak ada." });

  try {
    await (prisma as any).shippingZone.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Gagal menghapus zona." });
  }
}
