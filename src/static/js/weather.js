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
  isLoading: false,
  activeRequests: [],
  lastFetch: function(){
    var x = weather.cache().last;
    if (x) {var wData = weather.checkCache(x.lat,x.lng);}
    if (wData) {
      weather.cache('last',wData);
      return wData.w;
    } else {
      if (!weather.isLoading){
        weather.getLocal();
      }
      return false;
    }


  },
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
      weather.cache('last',{});
    }
    var lat = parseFloat((coords.lat).toFixed(4));
    var lng = parseFloat((coords.lng).toFixed(4));
    var data = weather.checkCache(lat,lng);

    if (data && !(callback == true)) { //if cached & direct request
      weather.cache('last',data);
      weather.isLoading = false;
    } else if (!data) { //if not cached
      weather.fetchByCoord(lat,lng,function(data){
        if (callback != true) {
          weather.isLoading = false;
          weather.cache('last',data);
        } else {
          if (typeof callback === 'function') callback(data);
        }
      });
    } else {
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

  getLocal: function(callback) {
    weather.fetchLocation(function(lat,lng){
      weather.get({lat,lng},callback);
    });
  },

  fetchByCoord: function(lat,lng,callback) {
    if (!weather.activeRequests.includes(`${lat},${lng}`)) {
      DEBUG('Fetching weather from: '+lat+', '+lng);
      //.push() returns index of new item
      var reqIndex = weather.activeRequests.push(`${lat},${lng}`);
      var start = new Date();
      $.getJSON('/API/weatherLookup'+
        '?latitude='+lat+
        '&longitude='+lng+
        '&units='+app.settings().units,
        function(data){
          weather.activeRequests.splice(reqIndex,1);
          data = {
            w: data,
            lat: lat,
            lng: lng,
            fetch: Date.now()
          }

          if (data.w.success) {
            data.w.timing.client = ((new Date()).getTime() - start.getTime()) / 1000;
            data.w.timing.tx_rx = data.w.timing.client - data.w.timing.serverTotal;

            weather.cache(lat+','+lng,data);
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
            if (typeof callback === 'function') callback(data);
          } else {
            n.info('Weather Fetch failed. ', data.w.error);
          }
        }
      ).fail(function(){
        console.warn('Uncaught server error... retrying');
        weather.activeRequests.splice(reqIndex,1);
        weather.fetchByCoord(lat,lng,callback);
      });
    } else {
      DEBUG('Duplicate request.');
      if (weather.checkCache(lat,lng))
        cache('last',weather.checkCache(lat,lng))

    }

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
}
