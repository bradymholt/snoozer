import { generateState, generateCodeVerifier } from "arctic";
import { Google } from "arctic";

import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const google = new Google(
    event.platform?.env.GOOGLE_CLIENT_ID!,
    event.platform?.env.GOOGLE_CLIENT_SECRET!,
    event.platform?.env.GOOGLE_REDIRECT_URI!
  );

  const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"]);

  event.cookies.set("google_oauth_state", state, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });
  event.cookies.set("google_code_verifier", codeVerifier, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
}
