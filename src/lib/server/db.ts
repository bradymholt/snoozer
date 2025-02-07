import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";

export let db: DrizzleD1Database;

export function initDB(env: Env | undefined) {  
  db ??= drizzle(env?.DB);
}