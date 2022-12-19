# Weather-Lite
A PWA that visualizes weather.
It features saving favorite locations, rain forecasts, heatmaps, etc.

Live Demo here: https://weatherlite.app

### A note on supportability
This project is by no means exemplary in terms of being supportable. I found joy in building out components like the service worker, frontend version control, caching, etc from scratch.
When building PWAs for customers, I would strongly recommend utilizing 3rd party libraries that have standardized these kinds of things. Many frontend frameworks like Angular and React have tried and tested libraries to solve these needs. BUT- if youre a nerd like me and want to learn ways to build this stuff from the ground up, look no further!

## Local Run

* setup local virtual environment (python 3)
* enter venv, run `pip install -r requirements.txt` 
  - encountered versioning problems in the past with windows
  - the actual code isnt picky about versioning - some libraries are, had success removing the versions in `requirements.txt`
* update config.ini with appropriate API keys
  - I wish there was a simpler way of running locally- but unfortunately, this app relies heavily on external datasources
* run: `python localrun.py`

## File tree
* src
  * app.py | main flask app
  * blueprints.py | creates necessary blueprints to separate out the URL routes
  * clientAssets.py | stores all the assets loaded in by the client (open the file for more info)
  * libraries
    - init.py | loads in all the necessary external libraries
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
    


