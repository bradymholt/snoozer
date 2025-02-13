import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "$lib/server/session";
import { drizzle } from "drizzle-orm/d1";
import { users } from "$lib/server/schema/users";
import { eq } from "drizzle-orm";
import { handleOAuthCallBack } from "$lib/server/googleOAuth";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
  const code = event.url.searchParams.get("code");
  const state = event.url.searchParams.get("state");
  const storedState = event.cookies.get("google_oauth_state") ?? null;
  const codeVerifier = event.cookies.get("google_code_verifier") ?? null;
  const googleAuth = await handleOAuthCallBack(
    {
      code,
      state,
      storedState,
      codeVerifier,
    },
    {
      clientId: event.platform?.env.GOOGLE_CLIENT_ID!,
      clientSecret: event.platform?.env.GOOGLE_CLIENT_SECRET!,
      redirectUri: event.platform?.env.GOOGLE_REDIRECT_URI!,
    },
  );

  if (!googleAuth) {
    return new Response(null, {
      status: 400,
    });
  }

  const db = drizzle(event.platform?.env.DB);
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.googleId, googleAuth.googleId));

  if (existingUser !== undefined) {
    // Existing user
    await db
      .update(users)
      .set({ name: googleAuth.name, email: googleAuth.email })
      .where(eq(users.id, existingUser.id));

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    setSessionTokenCookie(event, sessionToken, session.expiresAt);
  } else {
    // New user
    const [{ insertedId }] = await db
      .insert(users)
      .values({
        name: googleAuth.name,
        email: googleAuth.email,
        googleId: googleAuth.googleId,
      })
      .returning({ insertedId: users.id });

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, insertedId);
    setSessionTokenCookie(event, sessionToken, session.expiresAt);
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
}
