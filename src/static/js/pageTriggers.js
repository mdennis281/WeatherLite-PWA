/*
  Called from app.page.select(page)
    'page' is the object key used to determine
    what javasctipt to run.
    'page' is also used to make a request to the server:
      https://weatherlite.app/parts/'page'
*/
var pageTriggers = {
  weather: function(callback) {
    //if not recently loaded cached forecast info
    if (!weather.cache().last){ weather.getLocal() }
    ui.weather.render(callback);
    weather.getAll();
  },
  favorites: function(callback) {
    ui.favorites.generate();
    ui.favorites.updateSearch();
    callback();
  },
  settings: function(callback) {
    ui.settings.loadContext();
    $('#device-browser').html(device.getBrowser());
    $('#device-os').html(device.getOS());
    $('#device-isPWA').html((device.isPWA) ? 'Yes' : 'No');
    $('#app-version').html(app.settings().version);
    callback();
  },
  about: function(callback) {
    callback();
  },
  'iOS-PWA': function(callback) {
    callback();
  }
}
