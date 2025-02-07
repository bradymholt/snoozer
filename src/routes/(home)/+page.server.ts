import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import validate from "$lib/server/valdate";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/session";
import { contacts, contactValidator } from "$lib/server/schema/contacts";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return redirect(302, "/login");
  }

  return {
    contacts: await db.select().from(contacts),
  };
};

export const actions = {
  saveContact: async ({ request }) => {    
    const newContact = await validate(contactValidator, request);
    if (newContact.error) {
      return fail(422, { errors: newContact.errors });
    } else if (newContact.data.id) {
      await db.update(contacts).set(newContact.data).where(eq(contacts.id, newContact.data.id));
    } else {
      await db.insert(contacts).values(newContact.data);
    }
  },
  deleteContact: async ({ request }) => {    
    const id = (await request.formData()).get("id") as string;
    await db.delete(contacts).where(eq(contacts.id, parseInt(id, 10)));
  },
  logout: async ({ cookies, locals }) => {
    if (locals.session === null) {
      return fail(401);
    }
    
    await invalidateSession(locals.session.id);
    deleteSessionTokenCookie(cookies);
    return redirect(302, "/login");
  },
} satisfies Actions;
