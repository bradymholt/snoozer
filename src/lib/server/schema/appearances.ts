import { int, primaryKey, sqliteTable } from "drizzle-orm/sqlite-core";
import { events } from "./events";
import { contacts } from "./contacts";
import type { InferSelectModel } from "drizzle-orm";

export const appearances = sqliteTable(
  "appearances",
  {
    eventId: int().references(() => events.id, { onDelete: "cascade" }),
    contactId: int().references(() => contacts.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.eventId, t.contactId] })],
);

export type Appearance = InferSelectModel<typeof appearances>;
