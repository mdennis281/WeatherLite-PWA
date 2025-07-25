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
    'pages': [
        '/',
        '/parts/weather',
        '/parts/favorites',
        '/parts/settings',
        '/parts/about',
        '/parts/navbar',
        '/parts/popup',
        '/parts/iOS-PWA',
    ],
    'JS': [
        'https://code.jquery.com/jquery-3.4.1.min.js',
        'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js',
        'https://cdn.jsdelivr.net/npm/bootstrap-notify@3.1.3/bootstrap-notify.min.js',
        

        '/static/js/init.js',
        '/static/js/weather.js',
        '/static/js/PWANotify.js',
        '/static/js/popup.js',
        '/static/js/app.js',
        '/static/js/pageTriggers.js',
        '/static/js/maps.js',
        '/static/js/general.js',
        '/static/js/notify.js',
        '/static/js/device.js',
        '/static/js/txtFormat.js',
        '/static/js/SW.js',
        '/static/js/UI/weather.js',
        '/static/js/UI/favorites.js',
        '/static/js/UI/settings.js',
        '/static/js/UI.js',
        '/static/js/animatecss.min.js', # an oldie but a goodie
        
        '/static/js/classes/LocalWeather.js'
    ],
    'CSS': [
        'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css',
        'https://fonts.googleapis.com/css?family=Inconsolata&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.compat.css',
        'https://kit.fontawesome.com/6825e8f688.css',
        'https://ka-p.fontawesome.com/releases/v7.0.0/css/pro.min.css?token=6825e8f688',

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
        'https://fonts.gstatic.com/s/inconsolata/v18/QldKNThLqRwH-OJ1UHjlKGlZ5qg.woff2',
        '/manifest.json'
    ]
}

