/*
  The weather object is the external API into all weather data.
*/
weather = {
  _weatherLocations: [],
  _queuedLookup: null,

  /*
      populates weatherLocations with classes for both favorites & local weather
  */
  initialize: function(){
    DEBUG('Initializing Weather');
    
    weather._fetchLocation(function(lat,lng){
      weather._weatherLocations.push(new LocalWeather(lat,lng,'Local'));
    });
    maps.favorites.get().forEach(function(location){
      weather._weatherLocations.push(new LocalWeather(location.lat,location.lng,location.name));
    });
  },
  queue: function(coords) {
    if (coords) {
      DEBUG('Queueing coords: '+JSON.stringify(coords));
      weather._queuedLookup = weather._getWeatherObj(coords);
      return true;
    }
    return (weather._queuedLookup) ? true : false;
  },
  queueLocal: function(callback) {
    weather._fetchLocation(function(lat,lng){
      weather.queue({
        lat:lat,
        lng:lng
      });
      if (typeof callback === 'function') callback();
    })
  },
  _getWeatherObj: function(coords) {
    var ans = null;
    coordsStr = coords.lat+','+coords.lng;

    weather._weatherLocations.forEach(function(Wobj){
      if (Wobj.coords == coordsStr) ans = Wobj;
    }); 
    if (!ans) {
      ans = new LocalWeather(coords.lat,coords.lng);
      weather._weatherLocations.push(ans);
    }
    return ans;
  },
  getQueued: function(callback) {
    weather._queuedLookup.getWeather(callback);
    weather._queuedLookup = null;
  },
  _fetchLocation: function (callback) {
    navigator.geolocation.getCurrentPosition(function(position){
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      if (typeof callback === 'function') callback(lat,lng);
    },function(){ //fail
      $.getJSON('/API/IP2Coords',function(data){
        var lat = data.latitude;
        var lng = data.longitude;
        if (typeof callback === 'function') callback(lat,lng);
      })
    });
  },

  cache: function(newData=null,value=null) {
    if ((newData != null) && (value != null)) { //weather.cache(x,y)
      var settings = weather.cache();
      settings[newData] = value;
      app.storage('weatherCache',settings);
    } else if (newData != null) { //weather.cache(x)
      app.storage('weatherCache',newData);
    } else { //weather.cache()
      var weatherCache = app.storage('weatherCache');
      return (weatherCache) ? weatherCache : {};
    }
  },
  debugTiming: function(data) {
    DEBUG('--------------------');
    DEBUG('Weather API Timing:');
    DEBUG('Location: '+data.w.OWM.name);
    DEBUG('Client: '+data.w.timing.client.toFixed(3));
    DEBUG('Server: '+data.w.timing.serverTotal.toFixed(3));
    DEBUG('TX/RX: '+data.w.timing.tx_rx.toFixed(3));
    DEBUG('hourly: '+data.w.timing['hourly'].toFixed(3));
    DEBUG('daily: '+data.w.timing['daily'].toFixed(3));
    DEBUG('OWM: '+data.w.timing['OWM'].toFixed(3));
    DEBUG('--------------------');
  }
}
