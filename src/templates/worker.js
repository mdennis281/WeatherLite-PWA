var ACTIVECACHE = 'WL-{{appVersion}}';
var OFFLINECACHE = 'WL-Offline-{{appVersion}}';

var CACHES = [ACTIVECACHE,OFFLINECACHE];

var CACHED_ORIGINS = [
  'localhost',
  '127.0.0.1',
  'weatherlite.app',
  'ka-p.fontawesome.com',
  'fonts.gstatic.com'
]

var DYNAMIC_DATA = [
  '/api/weatherlookup',
  '/api/app/version'
]





// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  SWLog('Installing');
  event.waitUntil(
    addResourcesToCache()
  );
});



self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') { return; }

  event.respondWith((async () => {
    let response = await caches.match(event.request);

    if (!response) {
      SWLog(`Cache miss for ${event.request.url}. Attempting network fetch.`);
      try {
        response = await fetch(event.request);
        if (response && response.ok) {
          const rURL = event.request.url.toLowerCase();
          const isCachedOrigin = isURLInCachedOrigins(rURL);

          // Cache response if applicable
          if (isCachedOrigin && !isURLDynamicData(rURL)) {
            const cache = await caches.open(ACTIVECACHE);
            await cache.put(event.request, response.clone());
            SWLog(`Cached response for ${rURL}`);
          }
        } else {
          SWLog(`Network fetch failed or returned invalid response for ${event.request.url}.`);
        }
      } catch (error) {
        SWLog(`Network fetch error for ${event.request.url}: ${error.message}`);
      }
    }

    if (!response) {
      SWLog(`No valid response available for ${event.request.url}. Serving fallback response.`);
      response = new Response('Service is unavailable', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    return response;
  })());
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  SWLog('Activation Started');
  event.waitUntil(
    cleanupCaches()
  );
});

async function cleanupCaches() {
  var cacheNames = await caches.keys();
  var cachesToDelete = await cacheNames.filter(
    cacheName => !CACHES.includes(cacheName)
  );
  await cachesToDelete.map(cacheToDelete => {
    SWLog(`Deleting Cache - ${cacheToDelete}`);
    return caches.delete(cacheToDelete);
  })
  SWLog(`Claiming Client - SW Version - ${ACTIVECACHE}`)
  await self.clients.claim();

}


function SWLog(msg) {
/*
  enables verbose logging if running on localhost
*/
  var origin = self.location.origin;

  var l1 =  origin.includes('127.0.0.1');
  var l2 = origin.includes('localhost');

  console.log('SW :: '+msg);
}

function isURLDynamicData(url) {
  for (const urlPart of DYNAMIC_DATA) { 
    if (url.includes(urlPart)) {
      return true;
    }
  };
  return false;
}

async function addResourcesToCache() {
  var cache = await caches.open(ACTIVECACHE)
    SWLog('Adding precache');
    await cache.addAll(PRECACHE);
    SWLog('Precache added - Activating');
    self.skipWaiting();
};


function isURLInCachedOrigins(url) {
/*
  determines if passed url is in origin
  used to decide whether or not to cache the request
*/
  for (const origin of CACHED_ORIGINS) { 
    if (url.includes('//'+origin)) {
      return true;
    }
  };
  return false;
}


var PRECACHE = [
  {% for type in assets %}{% for link in assets[type] %}
  '{{link}}',{% endfor %}{% endfor %}
]