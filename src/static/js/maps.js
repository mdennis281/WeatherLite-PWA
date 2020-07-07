// used to interface with the webserver regarding:
//    Partial matches of geolocation names (adding favorites)
//    Matching geolocation names to favorites

var maps = {
  lookup: function(location,callback) {
    if (location) {
      $.get('/API/placesLookup?query='+location,function(data) {
        if (location == $('#favorite-searchbox').val()) {
          callback(data);
        }
      });
    }
  },
  favorites: {
    get: function() {
      var fl = app.storage('favoriteLocations');
      return (fl) ? fl : [];

    },
    add: function(name,callback) {
      var fl = maps.favorites.get();
      $.get('/API/address2Coords?address='+name,function(coords) {
        fl.push({
          name: name,
          lat: coords.lat,
          lng: coords.lng
        });
        weather.get(coords);
        app.storage('favoriteLocations',fl);

        if (typeof callback === 'function') callback();
      });
    },
    delete: function(name) {
      var fl_old = maps.favorites.get();
      var fl = [];
      var isFound = false;
      fl_old.forEach(function(location) {
        if ((!location.name.startsWith(name)) || (isFound)) {
          fl.push(location);
        } else {isFound = true;}
      });
      app.storage('favoriteLocations',fl);
    }
  }
}
