import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { extractAndValidate } from "$lib/server/valdate";
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
    const contact = await extractAndValidate(contactValidator, request);
    if (contact.error) {
      return fail(422, { errors: contact.errors });
    } else if (contact.data.id) {
      await db
        .update(contacts)
        .set(contact.data)
        .where(eq(contacts.id, contact.data.id));
    } else {
      await db.insert(contacts).values(contact.data);
    }
  },
  deleteContact: async ({ request }) => {
    const id = (await request.formData()).get("id") as string;
    await db.delete(contacts).where(eq(contacts.id, parseInt(id, 10)));
  },
} satisfies Actions;
