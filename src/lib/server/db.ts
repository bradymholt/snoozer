import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { dev } from "$app/environment";

export let db: DrizzleD1Database;

export function initDB(env: Env | undefined) {
  db ??= drizzle(env?.DB, { logger: dev });
}
