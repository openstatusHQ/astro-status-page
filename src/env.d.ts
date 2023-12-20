/// <reference types="astro/client" />

type ENV = {
    API_KEY: string;
  };


  type Runtime = import("@astrojs/cloudflare").AdvancedRuntime<ENV>;
  declare namespace App {
    interface Locals extends Runtime {}
  }