const cacheName = 'v1';

// Call Install Event
self.addEventListener('install', function (e) {
  console.log('Service Worker: Installed');
});

// Call Activate Event
self.addEventListener('activate', function (e) {
  console.log('Service Worker: Activated');
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cache) {
          if (cache !== cacheName) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
self.addEventListener('fetch', function (e) {
  console.log('Service Worker: Fetching');
  e.respondWith(
    fetch(e.request)
      .then(function (res) {
        // Make copy/clone of response
        const resClone = res.clone();
        // Open cahce
        caches.open(cacheName).then(function (cache) {
          // Add response to cache
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(function (err) {
        caches.match(e.request).then(function (res) {
          return res;
        });
      })
  );
});