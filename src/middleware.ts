import { defineMiddleware } from "astro:middleware";

// A status page must not lag far behind an incident: serve from cache for
// FRESH_SECONDS, then serve the stale copy while re-rendering in the
// background, and render synchronously once a copy is older than MAX_STALE.
const FRESH_SECONDS = 60;
const MAX_STALE_SECONDS = 300;
const CACHED_AT = "x-status-page-cached-at";
export const CACHEABLE = "x-status-page-cacheable";

// safe because workerd always exposes `caches.default`; the DOM CacheStorage
// type just doesn't declare it. Undefined outside workerd (e.g. `astro check`).
function edgeCache(): Cache | undefined {
  return (globalThis.caches as unknown as { default?: Cache } | undefined)
    ?.default;
}

function ageSeconds(res: Response): number {
  const cachedAt = Number(res.headers.get(CACHED_AT));
  return Number.isFinite(cachedAt) ? (Date.now() - cachedAt) / 1000 : Infinity;
}

async function store(cache: Cache, key: Request, res: Response) {
  if (res.status !== 200 || res.headers.get(CACHEABLE) !== "1") return;
  const copy = new Response(res.clone().body, res);
  copy.headers.delete(CACHEABLE);
  copy.headers.set(CACHED_AT, String(Date.now()));
  copy.headers.set("Cache-Control", `public, s-maxage=${MAX_STALE_SECONDS}`);
  await cache.put(key, copy);
}

function forClient(res: Response, status: "HIT" | "STALE" | "MISS") {
  const out = new Response(res.body, res);
  out.headers.delete(CACHEABLE);
  out.headers.delete(CACHED_AT);
  out.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  out.headers.set("x-status-page-cache", status);
  return out;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const cache = edgeCache();
  if (!cache || context.request.method !== "GET") return next();

  const url = new URL(context.request.url);
  url.search = "";
  const key = new Request(url.toString(), { method: "GET" });

  const cached = await cache.match(key);
  if (cached) {
    const age = ageSeconds(cached);
    if (age < FRESH_SECONDS) return forClient(cached, "HIT");
    if (age < MAX_STALE_SECONDS) {
      context.locals.cfContext.waitUntil(
        Promise.resolve(next()).then((res) => store(cache, key, res)),
      );
      return forClient(cached, "STALE");
    }
  }

  const res = await next();
  context.locals.cfContext.waitUntil(store(cache, key, res.clone()));
  return forClient(res, "MISS");
});
