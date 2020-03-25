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
  },
  about: function() {

  }
}
