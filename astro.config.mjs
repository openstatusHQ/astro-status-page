import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: "server",
  adapter: cloudflare({
    runtime: {
      mode: 'local',
      type: 'pages',
      bindings: {
        // example of a var binding (environment variable)
        "API_KEY": {
          type: "secret",
        }
      }
    }
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