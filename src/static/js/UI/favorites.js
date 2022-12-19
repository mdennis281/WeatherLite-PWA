var uiFavorites = {
    //populates the favorites list (runs on page load)
    generate: function() {
      //weather.getAll();
      var favorites = maps.favorites.get();
      $('#favorites-list').html('');
      favorites.forEach(function(location) {
        ui.favorites._createLocationEntry(
          location.name,
          'weather.queue({lat:'+location.lat+',lng:'+location.lng+'});'
        );
      });
    },
    //helper for ui.favorites.generate()
    _createLocationEntry(name,onClick) {
      $('#favorites-list').append(
        '<div class="favorite-entry list-item"'+
          'onclick="if(!$(this).hasClass(\'disabled\')){'+onClick+'app.page.select(\'weather\')}"'+
        '>' +
          '<p>'+name+'</p>'+
          '<div class="edit-entry div-hide">'+
            '<i '+
              'class="fad fa-trash-alt btn-active" '+
              'onclick="ui.favorites.delete(\''+name+'\')">'+
            '</i>'+
          '</div>'+
        '</div>'
      );
    },
    new: {
      //opens add a favorite screen
      open: function() {
        $('#favorites-container').addClass('div-hide');
        $('#new-favorite').removeClass('div-hide');
        ui.favorites.edit.stop();
        $('#favorite-searchbox').focus();
      },
      //closes add a favorite screen
      close: function() {
        $('#favorites-container').removeClass('div-hide');
        $('#new-favorite').addClass('div-hide');
        ui.favorites.generate();
      }
    },
    edit: {
      //allows you to remove favorites
      start: function() {
        $('#edit-favorite-btn').addClass('div-hide');
        $('#unedit-favorite-btn').removeClass('div-hide');
        $('.edit-entry').removeClass('div-hide');
        $('.edit-entry').animateCss('slideInRight')
        $('.list-item').addClass('disabled');
      },
      stop: function() {
        $('#unedit-favorite-btn').addClass('div-hide');
        $('#edit-favorite-btn').removeClass('div-hide');
        $('.list-item').removeClass('disabled');

        $('.edit-entry').animateCss('slideOutRight',function(){
          $('.edit-entry').addClass('div-hide');
        });
      }
    },
    //run when favorites page is edited, then entry is deleted
    delete: function(name) {
      maps.favorites.delete(name);
      ui.favorites.generate();
      $('.edit-entry').removeClass('div-hide');
      $('.list-item').addClass('disabled');
    },
    //run whenever the location search texbox changes
    updateSearch: function(query) {
      maps.lookup(query,function(results){
        $('#search-results').html('');
        results.forEach(function(result){
          $('#search-results').append(
            '<div class="list-item" onclick="ui.favorites.addEntry(\''+result+'\')">'+
              '<p>'+result+'</p>'+
            '</li>'
          );
        });
      });
      if (!query) { //if no results
        $('#search-results').html(
          '<div class="list-item bg-none">'+
            '<p>Please enter a city name in the textbox above</p>'+
          '</div>'
        );
      }
    },
    //run when a new favorite entry opt is selected
    addEntry: function(query) {
      maps.favorites.add(query,function(){
        ui.favorites.generate();
        ui.favorites.updateSearch('');
        $('#favorite-searchbox').val('');
        ui.favorites.new.close();
      });
    }
  }