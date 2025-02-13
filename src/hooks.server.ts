import {
  validateSessionToken,
  setSessionTokenCookie,
  deleteSessionTokenCookie,
} from "$lib/server/session";
import type { Handle, HandleServerError } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { initDB } from "$lib/server/db";

const handleDbInit: Handle = async ({ event, resolve }) => {
  initDB(event.platform?.env);
  return resolve(event);
};

const handleAuth: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get("session") ?? null;
  if (token === null) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await validateSessionToken(token);
  if (session !== null) {
    setSessionTokenCookie(event, token, session.expiresAt);
  } else {
    deleteSessionTokenCookie(event.cookies);
  }

  event.locals.session = session;
  event.locals.user = user;

  return resolve(event);
};

export const handle = sequence(handleDbInit, handleAuth);

export const handleError: HandleServerError = async ({
  error,
  event,
  status,
  message,
}) => {
  const err = error instanceof Error ? error : new Error(String(error));

  console.error("Unhandled error:", {
    message: err.message,
    stack: err.stack,
    url: event.url.toString(),
  });
};
