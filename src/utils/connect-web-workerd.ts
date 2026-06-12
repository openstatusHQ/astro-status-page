import type { ConnectTransportOptions } from "@connectrpc/connect-web";
import { createConnectTransport as createWebTransport } from "@connectrpc/connect-web";

// workerd's fetch only implements redirect "follow" | "manual"; connect-web
// defaults to "error". Inject a fetch that rewrites it.
export function createConnectTransport(options: ConnectTransportOptions) {
  return createWebTransport({
    ...options,
    fetch: (input, init) =>
      globalThis.fetch(input, { ...init, redirect: "manual" }),
  });
}
