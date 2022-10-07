// used to interface with the webserver regarding:
//    Partial matches of geolocation names (adding favorites)
//    Matching geolocation names to favorites

var maps = {
  lookup: function(location,callback) {
    if (location) {
      $.get('/API/placesLookup?query='+location,function(data) {
        if (location == $('#favorite-searchbox').val()) {
          if (!data.success)
            n.info('Google Places API Error',data.error);
          callback(data.data);

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
  },
  coord2Name: function(lat,lng,shortName=true) {
    var match = null;
    lat = parseFloat(lat).toFixed(3);
    lng = parseFloat(lng).toFixed(3);
    (maps.favorites.get()).forEach(function(location){
      var latMatch = (lat == location.lat.toFixed(3));
      var lonMatch = (lng == location.lng.toFixed(3));
      if (latMatch && lonMatch)
        match = location;

    });

    if (match && shortName) {
      return match.name.split(',')[0];
    } else if (match && match.name) {
      return match.name;
    } else {
      return weather.lastFetch().OWM.name;
    }

  }
}
