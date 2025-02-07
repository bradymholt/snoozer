import { generateSessionToken, createSession, setSessionTokenCookie } from "$lib/server/session";
import { drizzle } from "drizzle-orm/d1";
import { decodeIdToken } from "arctic";
import { users } from "$lib/server/schema/users";
import { eq } from "drizzle-orm";
import type { RequestEvent } from "@sveltejs/kit";
import type { OAuth2Tokens } from "arctic";
import { Google } from "arctic";

export async function GET(event: RequestEvent): Promise<Response> {
  const code = event.url.searchParams.get("code");
  const state = event.url.searchParams.get("state");
  const storedState = event.cookies.get("google_oauth_state") ?? null;
  const codeVerifier = event.cookies.get("google_code_verifier") ?? null;
  if (code === null || state === null || storedState === null || codeVerifier === null) {
    return new Response(null, {
      status: 400,
    });
  }
  if (state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    const google = new Google(
      event.platform?.env.GOOGLE_CLIENT_ID!,
      event.platform?.env.GOOGLE_CLIENT_SECRET!,
      event.platform?.env.GOOGLE_REDIRECT_URI!
    );
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch (e) {
    // Invalid code or client credentials
    return new Response(null, {
      status: 400,
    });
  }
  const claims: any = decodeIdToken(tokens.idToken());
  const googleId = claims.sub;
  const name = claims.name;
  const email = claims.email;

  const db = drizzle(event.platform?.env.DB);
  const [existingUser] = await db.select().from(users).where(eq(users.googleId, googleId));

  if (existingUser !== undefined) {
    await db.update(users).set({ name, email }).where(eq(users.id, existingUser.id));

    const sessionToken = generateSessionToken();
    const session = await createSession(db, sessionToken, existingUser.id);
    setSessionTokenCookie(event, sessionToken, session.expiresAt);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }

  const [{ insertedId }] = await db.insert(users).values({ name, email, googleId }).returning({ insertedId: users.id });

  const sessionToken = generateSessionToken();
  const session = await createSession(db, sessionToken, insertedId);
  setSessionTokenCookie(event, sessionToken, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
}
