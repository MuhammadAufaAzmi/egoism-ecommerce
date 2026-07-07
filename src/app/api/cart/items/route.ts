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

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const userId = session?.userId;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const body = await req.json();
    const { productId, size, color, fitType = "regular", quantity = 1 } = body;
    
    if (typeof quantity !== "number" || quantity <= 0 || quantity >= 100) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }
    
    const existing = await prisma.cart.findFirst({
      where: { userId, productId, size, color, fitType },
    });
    
    if (existing) {
      const updated = await prisma.cart.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
      return NextResponse.json({ item: updated });
    } else {
      const created = await prisma.cart.create({
        data: { userId, productId, size, color, fitType, quantity },
      });
      return NextResponse.json({ item: created });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    const userId = session?.userId;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const body = await req.json();
    const { cartId, quantity } = body;
    
    if (typeof quantity !== "number" || quantity <= 0 || quantity >= 100) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }
    
    await prisma.cart.updateMany({
      where: { id: cartId, userId },
      data: { quantity },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
