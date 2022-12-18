var ACTIVECACHE = 'weatherlite-{{appVersion}}';

var PRECACHE = [
  '/',
  '/?page=weather',
  '/?page=favorites',
  '/?page=settings',
  '/?page=about',
  {% for type in assets %}{% for link in assets[type] %}
  '{{link}}',
  {% endfor %}{% endfor %}
]

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(ACTIVECACHE).then(cache => {
      return cache.addAll(
        PRECACHE
      );
    }).then(self.skipWaiting())
  );
});


self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return caches.open(ACTIVECACHE).then(cache => {
        return fetch(event.request).then(response => {
          // if local
          if (event.request.url.startsWith(self.location.origin)) {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          } else {
            //dont cache the response
            return response;
          }
        });
      });
    })
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [ACTIVECACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        console.log(`SW -- Deleting Cache - ${cacheToDelete}`);
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});