var cacheName = 'weatherlite';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(
        [
          'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css',
          'https://cdn.devduo.us/bundles/FA/css/all.css',
          'https://cdn.devduo.us/bundles/FA/webfonts/fa-duotone-900.woff2',
          'https://cdn.devduo.us/bundles/FA/webfonts/fa-solid-900.woff2',
          'https://cdn.devduo.us/bundles/FA/webfonts/fa-brands-400.woff2',
          'https://code.jquery.com/jquery-3.4.1.min.js',
          'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js',
          'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js',
          'https://fonts.gstatic.com/s/inconsolata/v18/QldKNThLqRwH-OJ1UHjlKGlZ5qg.woff2',
          '/static/img/loading.gif',
          '/app/images/appIcon.png?width=32',
          '/app/images/appIcon.png?width=144',
          '/static/js/init.js',
          '/manifest.json'
        ]
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});
