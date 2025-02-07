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
      env: Env;
      cf: CfProperties;
      ctx: ExecutionContext;
    }
    // interface Error {}
    // interface PageData {}
    // interface PageState {}
  }
}

export {};
