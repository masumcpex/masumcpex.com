/*
  Masumcpex / WorkTrack service worker (v2)
  - Caches ONLY same-origin static files (pages, CSS, JS, images). Nothing from Firebase, Google or any other
    website is ever cached, so attendance data and login tokens never end up in a cache.
  - The shared view-only attendance page (/attendanceview/) is never intercepted or cached.
  - Pages are network-first, but if the network is slow (> 3 s) a saved copy is shown instead of waiting.
*/
const SW_VERSION   = "v2.0.0";
const STATIC_CACHE = `masumcpex-static-${SW_VERSION}`;
const PAGES_CACHE  = `masumcpex-pages-${SW_VERSION}`;
const OFFLINE_URL  = "offline.html";
const SLOW_NETWORK_MS = 3000;

const PRECACHE_URLS = [
  "index.html",
  "worktrack.html",
  "style.css",
  "worktrack.css",
  "script.js",
  "data.js",
  "contact.js",
  "manifest.json",
  "worktrack.webmanifest",
  "offline.html",
  "photo.png",
  "bdflag.webp",
  "wt-icon-192.png"
];

const NEVER_CACHE_HOSTS = [
  "googleapis.com",
  "gstatic.com",
  "firebaseapp.com",
  "firebaseio.com",
  "firebasestorage.app",
  "google.com",
  "accounts.google.com",
  "facebook.com",
  "fbcdn.net",
  "google-analytics.com",
  "googletagmanager.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com"
];

// Never touched by the service worker (private / token links)
const BYPASS_PATHS = ["/attendanceview/", "/attendanceview"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => Promise.all(PRECACHE_URLS.map((u) => cache.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("masumcpex-") && key !== STATIC_CACHE && key !== PAGES_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

function isNeverCacheHost(url) {
  return NEVER_CACHE_HOSTS.some((host) => url.hostname.endsWith(host));
}

const NETWORK_FIRST_FILES = [
  "data.js", "script.js", "style.css", "contact.js", "invest.js", "attendance.js",
  "khApp.js", "kh-auth.js", "firebase.js", "worktrack.css", "worktrack.webmanifest"
];

function isNetworkFirstAsset(url) {
  return NETWORK_FIRST_FILES.some((name) => url.pathname.endsWith(name));
}

function cacheable(response) {
  return response && response.status === 200 && response.type === "basic";
}

// Network first; if the network is slow, answer from the saved copy (when there is one) and refresh in background.
function networkFirst(request) {
  return new Promise((resolve) => {
    let settled = false;
    const done = (res) => { if (!settled) { settled = true; resolve(res); } };

    const timer = setTimeout(async () => {
      const cached = await caches.match(request);
      if (cached) done(cached);
    }, SLOW_NETWORK_MS);

    fetch(request)
      .then((response) => {
        clearTimeout(timer);
        if (cacheable(response)) {
          const copy = response.clone();
          caches.open(PAGES_CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
        }
        done(response);
      })
      .catch(async () => {
        clearTimeout(timer);
        const cached = await caches.match(request);
        if (cached) return done(cached);
        if (request.mode === "navigate") {
          const offline = await caches.match(OFFLINE_URL);
          if (offline) return done(offline);
        }
        done(Response.error());
      });
  });
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (isNeverCacheHost(url)) return;
  if (url.origin !== self.location.origin) return;
  if (BYPASS_PATHS.some((p) => url.pathname.startsWith(p))) return;
  if (url.searchParams.has("token")) return;
  if (request.headers.has("authorization")) return;

  if (
    request.mode === "navigate" ||
    (request.headers.get("accept") || "").includes("text/html") ||
    isNetworkFirstAsset(url)
  ) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Images and other static files: saved copy first, refreshed in the background.
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          if (cacheable(response)) {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => cached || Response.error());
      return cached || fetchPromise;
    })
  );
});
