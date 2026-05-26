self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("egoism-cache-v1").then((cache) => {
      return cache.addAll([
        "/",
        "/koleksi",
        "/men",
        "/women",
        "/manifest.json",
        "/favicon.ico"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
