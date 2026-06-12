import { fileURLToPath } from "node:url";
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
      "@openstatus/sdk-node",
      "@connectrpc/connect",
      "@connectrpc/connect-web",
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
      STATUS_PAGE_ID: envField.string({ context: "server", access: "secret" }),
    },
  },
  vite: {
    plugins: [tailwindcss(), ssrPreBundle],
    resolve: {
      // sdk-node hard-wires the Node http2 transport, which workerd lacks;
      // the shim provides a fetch-based, workerd-safe createConnectTransport.
      alias: {
        "@connectrpc/connect-node": fileURLToPath(
          new URL("./src/utils/connect-web-workerd.ts", import.meta.url),
        ),
      },
    },
  },
});
