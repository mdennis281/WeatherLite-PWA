var pageTriggers = {
  weather: function() {
    ui.weather.render();
  },
  favorites: function() {
    ui.favorites.generate();
    ui.favorites.updateSearch();
  },
  settings: function() {
    ui.settings.loadContext();
    $('#device-browser').html(device.getBrowser());
    $('#device-os').html(device.getOS());
    $('#device-isPWA').html((device.isPWA) ? 'Yes' : 'No');
  },
  about: function() {

  }
}
