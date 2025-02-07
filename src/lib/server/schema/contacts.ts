import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

export const contacts = sqliteTable("contacts", {
  id: int().primaryKey({ autoIncrement: true }),
  first_name: text().notNull(),
  last_name: text(),
  email: text(),
  phone: text(),
  birthday: text(),
  notes: text(),
});

export const contactValidator = createInsertSchema(contacts, {
  first_name: (schema) => schema.min(1, "required"),
  email: (schema) => schema.email().optional(),
  birthday: (schema) => schema.date().optional(),
});
