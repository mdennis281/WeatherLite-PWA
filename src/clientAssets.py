import time

# Stores all the files that get loaded by the client
# This is directly used in both the service worker & base HTML page
# any JSS/CSS files added here will be loaded into the application &
# cached by the service worker

# Files that use this object:
#    src/libraries/general.py >
#        src/templates/worker.js
#        src/templates/init/index.html

files = {
    'JS': [
        'https://code.jquery.com/jquery-3.4.1.min.js',
        'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js',
        'https://cdn.devduo.us/js/bootstrap-notify.min.js',
        'https://cdn.devduo.us/js/popper.1.11.0.min.js',

        '/static/js/init.js',
        '/static/js/weather.js',
        '/static/js/PWANotify.js',
        '/static/js/popup.js',
        '/static/js/app.js',
        '/static/js/UI.js',
        '/static/js/pageTriggers.js',
        '/static/js/maps.js',
        '/static/js/general.js',
        '/static/js/notify.js',
        '/static/js/device.js',

        '/static/js/classes/LocalWeather.js'
    ],
    'CSS': [
        'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css',
        'https://cdn.devduo.us/bundles/FA/css/all.css',
        'https://fonts.googleapis.com/css?family=Inconsolata&display=swap',
        'https://cdn.devduo.us/css/animate.css',

        '/static/css/general.css',
        '/static/css/app.css',
        '/static/css/popup.css',
        '/static/css/notify.css',
    ],
    'images': [
        '/app/images/appIcon.png?width=512',
        '/app/images/appIcon.png?width=256',
        '/app/images/appIcon.png?width=128',
        '/app/images/appIcon.png?width=64',
        '/app/images/appIcon.png?width=32',
        '/static/img/loading.gif'
    ],
    # assets called by aforementioned assets (CSS/JS).
    # the sole purpose of this is to get the serviceworker to cache these files
    # they dont need to be loaded at the initial load of the app, but the
    # external packages eventually use them.
    'subAssets': [
        'https://cdn.devduo.us/bundles/FA/webfonts/fa-duotone-900.woff2',
        'https://cdn.devduo.us/bundles/FA/webfonts/fa-solid-900.woff2',
        'https://cdn.devduo.us/bundles/FA/webfonts/fa-brands-400.woff2',
        'https://fonts.gstatic.com/s/inconsolata/v18/QldKNThLqRwH-OJ1UHjlKGlZ5qg.woff2',
        '/manifest.json'
    ]
}


# will recreate all the urls seen above, but append ?_=<EPOCH>
# I used this on line 17 of src/views/general.py
# This made the URL different than what was cached by the serviceworker
# meaning all files cached by the serviceworker were unused
# assets = randomize(files)
def randomize(assets):
    data = {}
    for k in assets.keys():
        data[k] = []
        for v in assets[k]:
            data[k].append(
                v+'?_='+str(time.time())
            )
    return data
