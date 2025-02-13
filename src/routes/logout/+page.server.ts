import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import {
  deleteSessionTokenCookie,
  invalidateSession,
} from "$lib/server/session";

export const load: PageServerLoad = async ({ locals, cookies }) => {
  if (locals.session === null) {
    return fail(401);
  }

  await invalidateSession(locals.session.id);
  deleteSessionTokenCookie(cookies);
  return redirect(302, "/login");
};
