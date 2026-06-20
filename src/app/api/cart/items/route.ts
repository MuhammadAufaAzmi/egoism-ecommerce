import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ items: [] });
    }

    const items = await prisma.cart.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedItems = items.map((item) => ({
      id: item.id,
      name: item.product.name,
      color: item.color,
      size: item.size,
      fitType: item.product.fitType,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
      productId: item.productId,
      slug: item.product.slug,
    }));

    return NextResponse.json({ items: formattedItems });
  } catch (error) {
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
