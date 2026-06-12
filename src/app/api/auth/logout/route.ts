import { getSession, clearSession, createSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  await clearSession();
  
  
  
  

  return NextResponse.json({ success: true });
}
