import { KVNamespace, DurableObjectNamespace } from "@cloudflare/workers-types";

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
    interface Platform {
      env: {
        DB: D1Database;
        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
        GOOGLE_REDIRECT_URI: string;
      };
      cf: CfProperties;
      ctx: ExecutionContext;
    }
    // interface Error {}
    // interface PageData {}
    // interface PageState {}
  }
}

export {};
