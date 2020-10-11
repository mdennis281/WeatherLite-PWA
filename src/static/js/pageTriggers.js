/*
  Called from app.page.select(page)
    'page' is the object key used to determine
    what javasctipt to run.
    'page' is also used to make a request to the server:
      https://weatherlite.app/parts/'page'
*/
var pageTriggers = {
  weather: function(callback) {
    //if not recently loaded cached forecast info && not loading anything
    if (!weather.cache().last && !weather.isLoading){
      weather.getLocal();
    }
    ui.weather.render(function(){
      //weather.getAll();
      callback();
    });
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
    weather.fetchLocation(function(lat,lng){
      $('#lat-val').html(Number((lat).toFixed(2)));
      $('#lon-val').html(Number((lng).toFixed(2)));
      var link = 'https://www.google.com/maps/place/'+lat+','+lng;
      $('#cl-link').html('<a target="_blank" href="'+link+'">Current Location</a>');
      callback();
    });
  },
  about: function(callback) {
    callback();
  },
  'iOS-PWA': function(callback) {
    callback();
  }
}
