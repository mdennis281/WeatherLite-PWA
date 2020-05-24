/*
  An admittedly messy solution to encapsulate all the javascript needed
  to make the individual pages functional.
*/
var ui = {
  weather: {
    //Called on weather page load
    //waits until the weather object is finished
    //loading. When it is, it will move onto ui.weather._render()
    render: function (callback) {
      if (weather.isLoading) {
        setTimeout(function(){ui.weather.render(callback);},100);
      } else {
        var wData = weather.lastFetch();
        if (wData) {
          ui.weather._render(wData);
          callback();
        } else {
          ui.weather.render(callback);
        }

      }
    },

    //Renders the webpage with data retrieved from weather.lastFetch()
    _render: function(wData) {
      var now = wData.NOAA.hourly.properties.periods[0];
      ui.weather.generate.radar(wData.call);
      ui.weather.generate.forecast.hourly(wData.NOAA.hourly.properties.periods);
      ui.weather.generate.forecast.daily(wData.NOAA.daily.properties.periods);
      $('#detailed-forecast-today').html(
        wData.NOAA.daily.properties.periods[0].detailedForecast
      );
      $('#temperature').html(
        now.temperature + '°' + now.temperatureUnit
      );
      $('#city').html(
        wData.NOAA.base.properties.relativeLocation.properties.city
      );
      $('#condition').html(now.shortForecast);
      $('#sunrise-time').html(
        app.strFormat.hourMin(wData.OWM.sys.sunrise * 1000)
      );
      $('#sunset-time').html(
        app.strFormat.hourMin(wData.OWM.sys.sunset * 1000)
      );
      $('#humidity').html(
        weather.lastFetch().OWM.main.humidity + '%'
      );
      $('#visibility').html(
        Math.round(weather.lastFetch().OWM.visibility/1609.34) + ' mi' //todo locality
      );

      $('#loader-container').remove();
      $('#weather-content').removeClass('div-hide');
    },

    //Logic to determine which icon to display for the user.
    //Used for both hourly and daily forecasts
    selectIcon: function(w) {
      var f = w.shortForecast;
      if (f.match(/Sunny|Clear/)) {
        if (w.isDaytime) {
          return 'fad fa-sun';
        } else {
          return 'fad fa-moon';
        }
      }
      if (f.match(/Snow|Flurry|Flurries/)) {
        return 'fad fa-snowflake';
      }
      if (f.match(/Rain|Showers|Thunder|Lightning|Drizzle|T-storms/)) {
        if (f.match(/(Scattered|Light|Slight|Patchy)/)) {
          if (w.isDaytime) {
            return 'fad fa-cloud-sun-rain';
          } else {
            return 'fad fa-cloud-moon-rain';
          }
        } else {
          return 'fad fa-cloud-showers-heavy';
        }
      }
      if (f.match(/Cloud/)) {
        if (f.match(/Part/)) {
          if (w.isDaytime) {
            return 'fad fa-cloud-sun';
          } else {
            return 'fad fa-cloud-moon';
          }
        } else {
          return 'fad fa-cloud';
        }
      }
      if (f.match(/Fog/)) {
        return 'fad fa-smog';
      }
      return 'fad fa-question';
    },
    //called from ui.weather._render()
    generate: {
      forecast: {
        //creates the horizontal scrolling hourly forecast table
        hourly: function(forecast) {
          forecast = forecast.slice(0,24);
          forecast.forEach(function(w,i){
            var time = app.strFormat.hour(w.startTime);
            if (!i) {time = 'Now'}
            $('#hourly-forecast').append(
              '<td alt="'+w.shortForecast+'"> '+
              '<div class="hourly-item" '+
                'data-toggle="tooltip" '+
                'data-html="true" '+
                'data-placement="top" '+
                'v-b-tooltip.hover.viewport '+
                'title="'+ui.weather.generate.forecast.hourlyDetail(w)+'"'+
              '>'+
                '<p class="time">'+time+'</p>'+
                '<i class="'+ui.weather.selectIcon(w)+'"></i>'+
                '<p class="wind">'+w.windSpeed+'</p>'+
                '<p class="temp">'+w.temperature+'°</p>'+
              '</div></td>'
            );
          });
        },
        //creates the tooltips when tapped
        hourlyDetail: function(x) {
          return '<p>'+x.shortForecast+'</p>' +
            '<p>Wind: '+x.windSpeed+' '+x.windDirection+'</p>';
        },
        //generate the daily table.
        //also generates the popup when clicking for details
        daily: function(forecast) {
          var i;
          for (i=0; i < forecast.length; i+=2) {
            $('#daily-forecast').append(
              '<tr onclick="popup.open(\''+ //popup content
                        ui.weather.generate.detail.daily(
                          forecast[i],
                          forecast[i+1]
                        )+
                        '\')" class="hover-pointer">' +
                '<td>'+app.strFormat.weekday(forecast[i].startTime)+'</td>'+
                '<td><i class="'+ui.weather.selectIcon(forecast[i])+'"></i></td>'+
                '<td>'+forecast[i].temperature+'°</td>'+
                '<td>'+forecast[i+1].temperature+'°</td>'+
              '</tr>'
            )
          }
        }
      },
      //this opens the radar screen
      radar: function(coords) {
        var url = 'https://maps.darksky.net/@radar,'+
                  coords.latitude+','+coords.longitude+',10'

        $('#radar-container .body').html('<iframe src="'+url+'" />')
      },
      detail: {
        //generates content seen when tapping the detail for weather
        //on a specific day
        daily: function(day,night) {
          buffer = '';
          buffer += '<h4>'+day.name+'</h4>';
          buffer += '<h6>'+day.temperature+'° - '+night.temperature+'°</h6>';
          buffer += '<p>'+day.detailedForecast+'</p><br/>';
          buffer += '<p> Wind: '+day.windSpeed+' '+day.windDirection+'</p>';
          buffer += '<hr />';
          buffer += '<h4>'+night.name+'</h4>';
          buffer += '<p>'+night.detailedForecast+'</p><br/>';
          buffer += '<p> Wind: '+night.windSpeed+' '+night.windDirection+'</p>';
          return buffer;
        }
      },
    },
    radar: {
      //shows the iframe
      open: function() {
        $('#radar-container').removeClass('div-hide');
        $('#radar-container .body iframe').focus();
      },
      //hides the iframe
      close: function() {
        $('#radar-container').addClass('div-hide');
        $('#weather-content').focus();
      }
    }
  },
  favorites: {
    //populates the favorites list (runs on page load)
    generate: function() {
      weather.getAll();
      var favorites = maps.favorites.get();
      $('#favorites-list').html('');
      favorites.forEach(function(location) {
        ui.favorites._createLocationEntry(
          location.name,
          'weather.get({lat:'+location.lat+',lng:'+location.lng+'})'
        );
      });
    },
    //helper for ui.favorites.generate()
    _createLocationEntry(name,onClick) {
      $('#favorites-list').append(
        '<div class="favorite-entry list-item"'+
          'onclick="if(!$(this).hasClass(\'disabled\')){'+onClick+';app.page.select(\'weather\')}"'+
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
  },
  settings: {
    //called when opening the page
    loadContext: function() {
      ui.settings.onlineMode.genToggle();

    },
    //refers to the onlinemode toggle btn
    onlineMode: {
      //defines what JS is run when the onlinemode toggle button
      //is toggled on and off
      genToggle: function() {
        general.createToggle(
          '#cached-mode-toggle', //parentElement
          !(app.devMode.isEnabled()), //isToggled
          function() { //Toggle on callback
            app.devMode.enable();
          },
          function() { //Toggle off callback
            app.devMode.disable();
          }
        )
      }
    },
  }
}
