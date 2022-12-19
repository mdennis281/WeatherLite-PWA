## index.html
the initial page loaded in when serving this app- it is tasked with loading in all the dependencies necessary to make this app work.
The other files are simply hooked into the index.

## meta.html
Subcomponent of the `index.html`.
Responsible for:
- Search engine optimization imagery and descriptions
- Google analytics hook
- Caching and viewport policies

## apple.html
Subcomponent of the `index.html`.
Stores SOME of the junk needed to meet the PWA standards for Apple.
Huge shoutout to: https://github.com/elegantapp/pwa-asset-generator

## favicon.html
Subcomponent of the `index.html`.
Just references to several sizes of favicons.