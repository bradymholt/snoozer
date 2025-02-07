import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import validate from "$lib/server/valdate";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/session";
import { contacts, contactInsertValidator, contactUpdateValidator } from "$lib/server/schema/contacts";

export const load: PageServerLoad = async ({ platform, locals }) => {
  if (!locals.user) {
    return redirect(302, "/login");
  }

  const db = drizzle(platform?.env.DB);
  return {
    contacts: await db.select().from(contacts),
  };
};

export const actions = {
  saveContact: async ({ request, platform }) => {
    const db = drizzle(platform?.env.DB);
    const newContact = await validate(contactInsertValidator, contactUpdateValidator, request);
    if (newContact.error) {
      return fail(422, { errors: newContact.errors });
    } else if (newContact.data.id) {
      await db.update(contacts).set(newContact.data).where(eq(contacts.id, newContact.data.id));
    } else {
      await db.insert(contacts).values(newContact.data);
    }
  },
  deleteContact: async ({ request, platform }) => {
    const db = drizzle(platform?.env.DB);
    const id = (await request.formData()).get("id") as string;
    await db.delete(contacts).where(eq(contacts.id, parseInt(id, 10)));
  },
  logout: async ({ cookies, platform, locals }) => {
    if (locals.session === null) {
      return fail(401);
    }

    const db = drizzle(platform?.env.DB);
    await invalidateSession(db, locals.session.id);
    deleteSessionTokenCookie(cookies);
    return redirect(302, "/login");
  },
} satisfies Actions;
