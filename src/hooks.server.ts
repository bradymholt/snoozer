import { validateSessionToken, setSessionTokenCookie, deleteSessionTokenCookie } from "$lib/server/session";
import { drizzle } from "drizzle-orm/d1";

import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get("session") ?? null;
  if (token === null) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const db = drizzle(event.platform?.env.DB);
  const { session, user } = await validateSessionToken(db, token);
  if (session !== null) {
    setSessionTokenCookie(event, token, session.expiresAt);
  } else {
    deleteSessionTokenCookie(event.cookies);
  }

  event.locals.session = session;
  event.locals.user = user;

  return resolve(event);
};
