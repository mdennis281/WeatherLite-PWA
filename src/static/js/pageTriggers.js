var pageTriggers = {
  weather: function() {
    if (!weather.cache().last){ weather.getLocal() }
    ui.weather.render();
    weather.getAll();
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
