import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { contacts } from "./contacts";
import { appearances, type Appearance } from "./appearances";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { InferSelectModel } from "drizzle-orm";

export const events = sqliteTable("events", {
  id: int().primaryKey({ autoIncrement: true }),
  date: text().notNull(),
  description: text(),
});

export const eventValidator = createInsertSchema(events, {
  date: (schema) => schema.date(),
});

export const getEventAppearancesByContact = async (
  db: DrizzleD1Database,
  events: Array<Event>,
  eventAppearances: Array<Appearance>
) => {
  const allContacts = await db.select().from(contacts);

  const eventIds = Array.from(new Set(events.map((e) => e.id)));
  const contactEventMap = new Map<number, Record<string, any>>();

  for (const c of allContacts) {
    contactEventMap.set(
      c.id,
      eventAppearances.filter((a) => a.contactId === c.id).map((a) => a.eventId)
    );
  }

  const results: Record<string, any>[] = [];
  for (const c of allContacts) {
    const item: Record<string, any> = { contact: c };
    for (const e of eventIds) {
      item[e.toString()] = contactEventMap.get(c.id)?.includes(e);
    }

    results.push(item);
  }

  return results;
};

export type Event = InferSelectModel<typeof events>;
