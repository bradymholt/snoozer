import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./src/lib/server/schema",
  dialect: "sqlite",
  dbCredentials: {
    url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/e7352547963de7050bd7d94658afc4fe78b61811b7815da12d90be8e863abf4d.sqlite",
  },
});
