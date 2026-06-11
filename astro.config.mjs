import { defineConfig, envField } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// Pre-bundle react + radix into the workerd SSR environment so the dep
// optimizer doesn't discover them mid-request and duplicate React.
// Workaround for https://github.com/withastro/astro/issues/16529
const ssrPreBundle = {
  name: "ssr-prebundle-react",
  configEnvironment(name, config) {
    if (name === "client") return;
    config.optimizeDeps ??= {};
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include ?? []),
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@radix-ui/react-hover-card",
      "astro/env/runtime",
    ];
  },
};

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: "server",
  adapter: cloudflare(),
  env: {
    schema: {
      API_KEY: envField.string({ context: "server", access: "secret" }),
      MONITOR_IDS: envField.string({ context: "server", access: "secret" }),
    },
  },
  vite: {
    plugins: [tailwindcss(), ssrPreBundle],
  },
});
