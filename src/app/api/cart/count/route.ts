import { getSession, clearSession, createSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
  const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ count: 0 });
    }

    const count = await prisma.cart.aggregate({
      where: { userId },
      _sum: { quantity: true },
    });

    return NextResponse.json({ count: count._sum.quantity || 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
