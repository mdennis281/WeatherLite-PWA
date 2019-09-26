weather = {
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
    weather.fetchLocation(function(){
      $.getJSON('/API/weather/byCoordinates'+
        '?latitude='+weather.coordinates.latitude+
        '&longitude='+weather.coordinates.longitude,
        function(data){
          if (typeof callback === 'function') callback();
        }
      );
    });
  },
  getInfoByCity: function(callback) {
    
  }
}
