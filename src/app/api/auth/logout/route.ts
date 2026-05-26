import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  cookieStore.set("user_role", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  
  cookieStore.set("user_id", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return NextResponse.json({ success: true });
}
