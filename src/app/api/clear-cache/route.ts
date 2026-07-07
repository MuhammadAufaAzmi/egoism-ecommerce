import { revalidateTag, revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  revalidateTag('products');
  revalidateTag('products-all');
  revalidateTag('related-products');
  revalidatePath('/', 'layout');
  return NextResponse.json({ revalidated: true, message: "Cache completely wiped." });
}
