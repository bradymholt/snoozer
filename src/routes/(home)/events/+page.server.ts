import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { db } from "$lib/server/db";
import { extract, validate } from "$lib/server/valdate";
import {
  events,
  eventValidator,
  getEventAppearancesByContact,
} from "$lib/server/schema/events";
import { appearances } from "$lib/server/schema/appearances";
import { eq, desc, inArray } from "drizzle-orm";
import { contacts } from "$lib/server/schema/contacts";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return redirect(302, "/login");
  }

  const recentEvents = await db
    .select()
    .from(events)
    .orderBy(desc(events.date))
    .limit(5);
  const recentEventAppearances = await db
    .select()
    .from(appearances)
    .where(
      inArray(
        appearances.eventId,
        recentEvents.map((e) => e.id),
      ),
    );

  return {
    recentEvents,
    recentEventAppearances,
    contacts: await db.select().from(contacts),
    eventAppearancesByContact: await getEventAppearancesByContact(
      db,
      recentEvents,
      recentEventAppearances,
    ),
  };
};

export const actions = {
  saveEvent: async ({ request }) => {
    const eventData = await extract(request);
    const event = await validate(eventValidator, eventData);
    if (event.error) {
      return fail(422, { errors: event.errors });
    } else if (event.data.id) {
      await db
        .update(events)
        .set(event.data)
        .where(eq(events.id, event.data.id));
      // For simplicity, we delete all appearances and re-insert them
      await db
        .delete(appearances)
        .where(eq(appearances.eventId, event.data.id));
      await saveAppearances(event.data.id, eventData.contacts);
    } else {
      const [{ insertedEventId }] = await db
        .insert(events)
        .values(event.data)
        .returning({ insertedEventId: events.id });

      await saveAppearances(insertedEventId, eventData.contacts);
    }
  },
  deleteEvent: async ({ request }) => {
    const id = (await request.formData()).get("id") as string;
    await db.delete(events).where(eq(events.id, parseInt(id, 10)));
  },
} satisfies Actions;

async function saveAppearances(eventId: number, contacts: unknown) {
  if (Array.isArray(contacts) && contacts.length > 0) {
    const contactAppearances = contacts.map((contactId: number) => ({
      eventId: eventId,
      contactId,
    }));
    await db.insert(appearances).values(contactAppearances);
  }
}
