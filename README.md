# Weather-Lite
A PWA that visualizes weather.
It features saving favorite locations, rain forecasts, heatmaps, etc.

This is licensed as MIT- so use it how you want.

Live Demo here: https://weatherlite.app

I have commented each file out pretty well. So it should prove pretty easy to reverse engineer.

## File tree
* src
  * app.py | main flask app
  * blueprints.py | creates necessary blueprints to separate out the URL routes
  * clientAssets.py | stores all the assets loaded in by the client (open the file for more info)
  * libraries
    - init.py | loads in all the necessary external libraries
    - APIKeys.py | holds all the sensitive info needed to create connections to external services
    - general.py | has functions for things like image manipulation and IP2coordinate conversions
    - googleMaps.py | all the API calls to GCP
    - weather.py | all the API calls to NOAA and OWM
  - static
    - js | JS asset folder
    - css | CSS asset foler
    - Font
      - Inconsolata-Regular.ttf | used in image generation within general.py
    - img | image asset folder
    - manifest.json | PWA manifest for google / android
  - templates
    - init | all the HTML files needed for the initial page load
    - parts | all the HTML sub-parts of the webpage ( weather page, navbar, popup, favorites page)
    - worker.js | the PWA worker file (used for caching assets)
  - views
    - API.py | all calls within ./API/* scope
    - appImages.py | all calls within ./app/images/* scope
    - general.py | calls within /* scope
    - parts.py | all calls within /parts/* scope
    


