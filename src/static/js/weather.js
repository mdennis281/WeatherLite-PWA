weather = {
  lastFetch: null,
  isLoading: false,
  fetchLocation: function (callback) {

    navigator.geolocation.getCurrentPosition(function(position){
      weather.coordinates.latitude = position.coords.latitude;
      weather.coordinates.longitude = position.coords.longitude;
      if (typeof callback === 'function') callback();
    });
  },
  coordinates: {
    latitude: null,
    longitude: null
  },
  getInfoByLocation: function(callback) {
    weather.isLoading = true;
    weather.fetchLocation(function(){
      $.getJSON('/API/weather/byCoordinates?units=metric'+ //TODO LOCALITY ISSUE
        '&latitude='+weather.coordinates.latitude+
        '&longitude='+weather.coordinates.longitude,
        function(data){
          weather.lastFetch = data;
          weather.isLoading = false;
          if (typeof callback === 'function') callback(data);
        }
      );
    });
  },
  getInfoByCity: function(callback) {
    weather.isLoading = true;

    weather.lastFetch = data;
    weather.isLoading = false;
  }
}

// loads in current browser location's weather data,
// this is added here because the initial page needs this info.
// added here for faster loadtimes.
weather.getInfoByLocation();
