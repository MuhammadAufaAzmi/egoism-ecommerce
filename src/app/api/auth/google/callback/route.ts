import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/login?error=OAuthCodeMissing`);
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Token Error:", tokenData);
      return NextResponse.redirect(`${baseUrl}/login?error=TokenExchangeFailed`);
    }

    // 2. Fetch user profile from Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userResponse.json();

    if (!userData.email) {
      return NextResponse.redirect(`${baseUrl}/login?error=EmailNotProvided`);
    }

    // 3. Find or Create User in DB
    // We only select fields that definitely exist in the DB
    let user = await prisma.user.findUnique({
      where: { email: userData.email },
      select: { id: true, email: true, role: true, firstName: true },
    });

    if (!user) {
      // Create new user — use sentinel password for Google OAuth users
      const crypto = await import("crypto");
      const sentinelPassword = "GOOGLE_OAUTH::" + crypto.randomUUID();
      const newUser = await prisma.user.create({
        data: {
          email: userData.email,
          firstName: userData.name || userData.given_name || "",
          role: "USER",
          password: sentinelPassword, // Satisfies NOT NULL; never used for login
        },
        select: { id: true, email: true, role: true, firstName: true },
      });
      user = newUser;
    }

    // 4. Set Session Cookies
    const cookieStore = await cookies();
    cookieStore.set("user_role", user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    cookieStore.set("user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    // 5. Redirect to Home
    return NextResponse.redirect(`${baseUrl}/`);

  } catch (error: any) {
    console.error("Google Auth Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(errorMessage)}`);
  }
}
