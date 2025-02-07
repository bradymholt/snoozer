import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "@sveltejs/adapter-cloudflare";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      routes: {
        include: ["/*"],
        exclude: ["<all>"],
      },
      platformProxy: {
        configPath: "wrangler.json",
        environment: undefined,
        experimentalJsonConfig: false,
        persist: true,
      },
    }),
  },

  compilerOptions: {
    // warningFilter: (warning) => !warning.code.startsWith('a11y_no_noninteractive_element_interactions')
  },
};

export default config;
