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
      var locations = [];
      var data = localStorage.favoriteLocations;
      var locationList = data.split("\n");
      locationList.forEach(function(locationRaw){
        var location = locationRaw.split('\t');
        if (location.length == 3) {
          locations.push({
            'name': location[0],
            'lat': location[1],
            'lon': location[2]
          });
        }
      });
      return locations;
    },
    add: function(name) {
      $.get('/API/address2Coords?address='+name,function(coords) {
        localStorage.favoriteLocations +=
          name + '\t' + coords.lat + '\t' + coords.lng + '\n';
        ui.favorites.generate();
      });
    },
    delete: function(name) {
      var locationList = localStorage.favoriteLocations.split('\n');
      var buffer = '';
      locationList.forEach(function(location) {
        if (!location.startsWith(name)) {
          buffer += location + '\n';
        }
      });
      localStorage.favoriteLocations = buffer;
    }
  }
}
