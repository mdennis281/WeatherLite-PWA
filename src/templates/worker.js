var ACTIVECACHE = 'weatherlite-{{appVersion}}';



function SWLog(msg) {
  var origin = self.location.origin;

  var l1 =  origin.includes('127.0.0.1');
  var l2 = origin.includes('localhost');

  if (l1 || l2) {
    console.log('SW :: '+msg)
  }
}

async function addResourcesToCache() {
  var cache = await caches.open(ACTIVECACHE)
    SWLog('Adding precache');
    await cache.addAll(PRECACHE);
    SWLog('Precache added - Activating');
    self.skipWaiting();
};

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  SWLog('Installing');
  event.waitUntil(
    addResourcesToCache()
  );
});



self.addEventListener('fetch', function(event) {

  event.respondWith((async () => {

    //check cache
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    }

    //fetch from external
    const response = await fetch(event.request)
    
    var rURL = event.request.url;
    var origin = self.location.origin;

    // if local
    if (rURL.startsWith(origin)) {
      var wDataURL =  origin + '/API/weatherLookup';
      //if not API
      if (rURL.startsWith(wDataURL)) {
        // Put a copy of the response in the runtime cache.
        var cache = await caches.open(ACTIVECACHE)
        await cache.put(event.request, response.clone())
        SWLog(`cached: ${rURL}`);
      }
    } 
    
    return response;

  })());
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [ACTIVECACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        SWLog(`Deleting Cache - ${cacheToDelete}`);
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});


var PRECACHE = [
  {% for type in assets %}{% for link in assets[type] %}
  '{{link}}',{% endfor %}{% endfor %}
]