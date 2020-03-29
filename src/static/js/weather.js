weather = {
  lastFetch: function(){
    return weather.cache().last.w;
  },
  isLoading: false,
  get: function(coords,callback) {
    weather.isLoading = true;
    var lat = parseFloat((coords.lat).toFixed(4));
    var lng = parseFloat((coords.lng).toFixed(4));
    var data = weather.checkCache(lat,lng);
    if (data && !(callback)) {
      weather.cache('last',data);
      weather.isLoading = false;
    } else if (!data) {
      weather.fetchByCoord(lat,lng,callback);
    } else {
      weather.isLoading = false;
      if (typeof callback === 'function') callback(data);
    }
  },
  getAll: function() {
    weather.getLocal(true);
    var fl = maps.favorites.get();
    fl.forEach(function(location){
      weather.get(location,true);
    });
  },
  fetchLocation: function (callback) {
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

  getLocal: function(callback=false) {
    weather.isLoading = true;
    weather.fetchLocation(function(lat,lng){
      weather.get({lat,lng},callback);
    });
  },

  fetchByCoord: function(lat,lng,callback) {
    weather.isLoading = true;
    DEBUG('Fetching weather from: '+lat+', '+lng);
    $.getJSON('/API/weatherLookup'+
      '?latitude='+lat+
      '&longitude='+lng,
      function(data){
        data = {
          w: data,
          fetch: Date.now()
        }
        weather.cache('last',data);
        weather.cache(lat+','+lng,data);

        weather.isLoading = false;
        if (typeof callback === 'function') callback(data);
      }
    );
  },
  checkCache: function(lat,lng) {
    var data = weather.cache()[lat+','+lng]
    if (data) { // if cached data exists
      if (app.strFormat.hour(data.fetch) == app.strFormat.hour(Date.now())) { //if hour is same
        if((Date.now()-data.fetch)/1000 < 60*30) { //if last grab was < 30 min ago
          return data;
        }
      }
    }
    return false;
  },
  cache: function(newData=null,value=null) {
    if (newData && value) {
      var settings = weather.cache();
      settings[newData] = value;
      app.storage('weatherCache',settings);
    } else if (newData) {
      app.storage('weatherCache',newData);
    } else {
      var weatherCache = app.storage('weatherCache');
      return (weatherCache) ? weatherCache : {};
    }
  }
}
