import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  // @ts-ignore
  revalidateTag('products');
  // @ts-ignore
  revalidateTag('products-all');
  revalidatePath('/', 'layout');
  return NextResponse.json({ revalidated: true, message: "Cache completely wiped." });
}
