import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  if (!clientId) {
    // Redirect dengan error agar user tahu apa yang salah
    return NextResponse.redirect(`${baseUrl}/login?error=OAuthNotConfigured`);
  }

  const oauth2Url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  oauth2Url.searchParams.set("client_id", clientId);
  oauth2Url.searchParams.set("redirect_uri", redirectUri);
  oauth2Url.searchParams.set("response_type", "code");
  oauth2Url.searchParams.set("scope", "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile");
  oauth2Url.searchParams.set("access_type", "online");

  return NextResponse.redirect(oauth2Url.toString());
}
