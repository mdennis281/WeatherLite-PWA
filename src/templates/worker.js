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

    //check cache
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    }

    //fetch from external
    const response = await fetch(event.request).catch(() => caches.match(OFFLINECACHE))
    
    var rURL = event.request.url.toLowerCase();
    var isCachedOrigin = isURLInCachedOrigins(rURL);


    // if local
    if (isCachedOrigin) {
      //if not Dynamic data from API
      if (!isURLDynamicData(rURL)) {
        // Put a copy of the response in the runtime cache.
        var cache = await caches.open(ACTIVECACHE)
        await cache.put(event.request, response.clone())
        SWLog(`cached: ${rURL}`);
      } else {
        SWLog(`Skipped cache - URLPathFilter : ${rURL}`);
        var offlineCache = await caches.open(OFFLINECACHE);
        await offlineCache.put(event.request, response.clone())
      }
    } else {
      SWLog(`Skipped cache - OriginFilter : ${rURL}`);
      var offlineCache = await caches.open(OFFLINECACHE);
      await offlineCache.put(event.request, response.clone())
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

  if (l1 || l2) {
    console.log('SW :: '+msg)
  }
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