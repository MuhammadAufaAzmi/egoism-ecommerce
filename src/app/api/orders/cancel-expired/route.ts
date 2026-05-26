import { NextResponse } from "next/server";
import { cancelExpiredOrders } from "@/lib/admin";

export async function GET(req: Request) {
  try {
    // Opsional: Tambahkan header authorization statis agar tidak sembarang orang bisa panggil (Cron Secret)
    const authHeader = req.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET || "default-cron-secret-123";
    
    if (authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ success: false, message: "Unauthorized cron execution" }, { status: 401 });
    }

    const result = await cancelExpiredOrders();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
