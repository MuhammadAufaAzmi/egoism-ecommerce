import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  if (!clientId) {
    // Redirect dengan error agar user tahu apa yang salah
    return NextResponse.redirect(`${baseUrl}/login?error=OAuthNotConfigured`);
  }

  const state = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });

  const oauth2Url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  oauth2Url.searchParams.set("client_id", clientId);
  oauth2Url.searchParams.set("redirect_uri", redirectUri);
  oauth2Url.searchParams.set("response_type", "code");
  oauth2Url.searchParams.set("scope", "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile");
  oauth2Url.searchParams.set("access_type", "online");
  oauth2Url.searchParams.set("state", state);

  return NextResponse.redirect(oauth2Url.toString());
}
