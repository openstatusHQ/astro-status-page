import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  output: "server",
  adapter: cloudflare({
    runtime: {
      mode: "local",
      type: "pages",
      bindings: {
        // example of a var binding (environment variable)
        API_KEY: {
          type: "secret",
        },
      },
    },
  }),
});

// // https://astro.build/config
// export default defineConfig({
//   integrations: [tailwind()],
//   output: "server",
//   adapter: node({
//     mode: "standalone"
//   })
// });
