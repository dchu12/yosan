/* Yosan taken offline — kill-switch service worker.
 * Replaces the app's caching SW: on activation it wipes all caches, unregisters
 * itself, and reloads any open tabs so they load the offline placeholder.
 * To bring the app back, revert the commit that introduced this file. */
self.addEventListener("install", function (e) { self.skipWaiting(); });
self.addEventListener("activate", function (e) {
  e.waitUntil((async function () {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(function (k) { return caches.delete(k); }));
    } catch (e) {}
    try { await self.registration.unregister(); } catch (e) {}
    try {
      const cs = await self.clients.matchAll({ type: "window" });
      cs.forEach(function (c) { if (c.navigate) c.navigate(c.url); });
    } catch (e) {}
  })());
});
