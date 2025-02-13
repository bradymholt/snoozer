import { eq } from "drizzle-orm";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { Cookies, RequestEvent } from "@sveltejs/kit";
import { sessions } from "$lib/server/schema/sessions";
import { users } from "$lib/server/schema/users";
import { db } from "$lib/server/db";

import type { Session } from "$lib/server/schema/sessions";
import type { User } from "$lib/server/schema/users";

const ONE_DAY_MS = 1000 * 60 * 60 * 24;
const THIRTY_DAYS_MS = ONE_DAY_MS * 30;
const FIFTEEN_DAYS_MS = ONE_DAY_MS * 15;
const TOKEN_LENGTH = THIRTY_DAYS_MS;

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  userId: number,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + TOKEN_LENGTH),
  };
  await db.insert(sessions).values(session);
  return session;
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await db
    .select({ user: users, session: sessions })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId));
  if (result.length < 1) {
    return { session: null, user: null };
  }
  const { user, session } = result[0];
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessions).where(eq(sessions.id, session.id));
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - FIFTEEN_DAYS_MS) {
    // If we're within 15 days of the session expiring, extend the session's expiration date to 30 days from now.
    session.expiresAt = new Date(Date.now() + THIRTY_DAYS_MS);
    await db
      .update(sessions)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(sessions.id, session.id));
  }
  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export function setSessionTokenCookie(
  event: RequestEvent,
  token: string,
  expiresAt: Date,
): void {
  event.cookies.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    expires: expiresAt,
    secure: import.meta.env.PROD,
    path: "/",
  });
}

export function deleteSessionTokenCookie(cookies: Cookies): void {
  cookies.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
