var maps = {
  lookup: function(location,callback) {
    $.get('/API/location2Coords?address='+location,function(data) {
      var entries = [];
      data.results.forEach(function(entry) {
        entries.push(
          {
            'address': entry.formatted_address,
            'coords': {
              'lat': entry.geometry.location.lat,
              'lon': entry.geometry.location.lng
            }
          }
        )
      });
      callback(entries);
    });
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
    add: function(name,lat,lon) {
      localStorage.favoriteLocations +=
        name + '\t' + lat + '\t' + lon + '\n';
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
