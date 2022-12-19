var sw = {

    logActiveStatus: async function() {
        app.storage('sw-status',{
            state: await sw.getState(),
            caches: [],
            requests: []
        })
        var swStatus = app.storage('sw-status');

        if (swStatus.state) {
            swStatus.caches = await sw.getCaches();
            app.storage('sw-status',swStatus);
            swStatus.caches.forEach(async (cache) => {
                var reqs = await sw.getCachedRequests(cache);
                reqs.forEach(req => {
                    swStatus.requests.push(
                        [cache, req.url]
                    );
                    app.storage('sw-status',swStatus);
                });
            })
        }
        if (!swStatus.state || !swStatus.caches.length) {
            setTimeout(() => { sw.logActiveStatus() },1000);
        } else {
            DEBUG('SW fully initialized');
        }
        
    },


    getCaches: async function() {
        var cacheNames = await caches.keys();
        return cacheNames
    },

    getCachedRequests: async function(cacheName) {
        var cache = await caches.open(cacheName);
        var cacheKeys = await cache.keys();
        return cacheKeys;
    },
    getState: async function() {
        if (navigator.serviceWorker) {
            var registration = await navigator.serviceWorker.getRegistration();
            if (registration.active) {
                return registration.active.state
            }
        }
        return false;
    }

}