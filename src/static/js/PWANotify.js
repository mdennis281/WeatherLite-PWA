/*
  Desc: Notify mobile users to install as PWA
  Dependencies:
    NotifyJS
    iOS & Android webparts
    device.js
    app.js
*/
function PWANotify() {
  if (device.getOS() == 'iOS') { //if iOS
    if (!device.isPWA) { // if not already PWA
      $.notify(
        'This app works best as a PWA.<br />'+
        'Tap here for installation instructions!',
        'iOS-PWA-Notify'
      );

    }
  }
}
