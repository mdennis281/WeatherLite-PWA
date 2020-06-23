/*
  the weather object is an extremely overcomplicated tool
  that relies heavily on timing.

  When the weather page is loaded, ui.weather.generate()
  loops through a call until the following condition is true:
    (weather.lastFetch != null) && (weather.isLoading == false)

  There is a forecast caching feature that caches all forecasts if:
    (current hour == current hour when data was cached) &&
    (cache time < 30 minutes from now)

  The app automatically checks the cache of all favorited locations
  when the user opens the weather page or the favorites page.
*/
weather = {
  lastFetch: function(){
    var x = weather.cache().last;
    if (x) {var wData = weather.checkCache(x.lat,x.lng);}
    if (wData) {
      weather.cache('last',wData);
      return wData.w;
    } else {
      weather.getLocal();
      return false;
    }

  },
  isLoading: false,
  get: function(coords,callback) {
    //a way to determine if the data was fetched directly
    //or if the application was attempting to cache
    //all favorites.
    //This prevents the wrong weather data from being loaded
    //unintentionally.
    // TLDR: if callback == true, it's not the user directly asking
    // to see this data.
    if (callback != true) {
      weather.isLoading = true;
    }
    var lat = parseFloat((coords.lat).toFixed(4));
    var lng = parseFloat((coords.lng).toFixed(4));
    var data = weather.checkCache(lat,lng);

    if (data && !(callback == true)) {
      weather.cache('last',data);
      weather.isLoading = false;
    } else if (!data) {
      weather.fetchByCoord(lat,lng,function(data){
        if (callback != true) {
          weather.cache('last',data);
        } else {
          if (typeof callback === 'function') callback(data);
        }
      });
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
          lat: lat,
          lng: lng,
          fetch: Date.now()
        }

        if (data.w.success) {
          weather.cache(lat+','+lng,data);
          weather.isLoading = false;
          if (typeof callback === 'function') callback(data);
        } else {
          n.info('Weather Fetch failed. ', data.w.error);
        }
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
    if ((newData != null) && (value != null)) {
      var settings = weather.cache();
      settings[newData] = value;
      app.storage('weatherCache',settings);
    } else if (newData != null) {
      app.storage('weatherCache',newData);
    } else {
      var weatherCache = app.storage('weatherCache');
      return (weatherCache) ? weatherCache : {};
    }
  }
}
