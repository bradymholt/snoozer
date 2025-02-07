import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import type { InferSelectModel } from "drizzle-orm";

export const sessions = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at", {
    mode: "timestamp",
  }).notNull(),
});

export type Session = InferSelectModel<typeof sessions>;
