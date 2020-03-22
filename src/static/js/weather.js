weather = {
  lastFetch: null,
  isLoading: false,
  fetchLocation: function (callback) {
    navigator.geolocation.getCurrentPosition(function(position){
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      if (typeof callback === 'function') callback(lat,lon);
    },function(){ //fail
      $.getJSON('/API/IP2Coords',function(data){
        var lat = data.latitude;
        var lon = data.longitude;
        if (typeof callback === 'function') callback(lat,lon);
      })
    });
  },

  getLocal: function() {
    weather.isLoading = true;
    weather.fetchLocation(function(lat,lon){
      weather.getByCoord(lat,lon);
    });
  },

  getByCoord: function(lat,lon,callback) {
    weather.isLoading = true;
    DEBUG('Fetching weather from: '+lat+', '+lon);
    $.getJSON('/API/weatherLookup'+
      '?latitude='+lat+
      '&longitude='+lon,
      function(data){
        weather.lastFetch = data;
        weather.isLoading = false;
        if (typeof callback === 'function') callback(data);
      }
    );
  },
}

// loads in current browser location's weather data,
// this is added here because the initial page needs this info.
// added here for faster loadtimes.
weather.getLocal();
