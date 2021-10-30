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
        setTimeout(function(){ui.weather.render(callback);},150);
      } else {
        var wData = weather.lastFetch();
        if (wData) {
          ui.weather._render(wData);
          callback();
        } else {
          setTimeout(function(){ui.weather.render(callback);},150);
        }
      }
    },

    //Renders the webpage with data retrieved from weather.lastFetch()
    _render: function(wData) {
      var now = wData.hourly[0];
      var today = wData.daily[0];
      ui.weather.generate.radar(wData.call);
      ui.weather.generate.forecast.hourly(wData.hourly.slice(0, 23));
      ui.weather.generate.forecast.daily(wData.daily.slice(0, 6));

      $('#detailed-forecast-today').html(
        app.strFormat.genDesc(today)
      );
      $('#temperature').html(
        now.values.temperature.toFixed(0)+ '°' + app.units.temp()
      );
      $('#city').html(
        maps.coord2Name(wData.call.latitude,wData.call.longitude)
      );
      $('#condition').html(ui.weather.codeToStr(now));
      $('#sunrise-time').html(
        app.strFormat.hourMin(wData.OWM.sys.sunrise*1000)
      );
      $('#sunset-time').html(
        app.strFormat.hourMin(wData.OWM.sys.sunset*1000)
      );
      $('#humidity').html(
        wData.OWM.main.humidity + '%'
      );
      $('#visibility').html(
        now.values.visibility + ' ' + app.units.dist()
      );

      $('#loader-container').remove();
      $('#weather-content').removeClass('div-hide');
    },

    //Logic to determine which icon to display for the user.
    //Used for both hourly and daily forecasts
    selectIcon: function(w) {
      var f = w.values.weatherCode;
      var isDay = app.strFormat.isDaytime(w.startTime);

      if (f == 6201) { return 'fas fa-cloud-sleet' }
      else if (f == 6001) { return 'far fa-cloud-sleet' }
      else if (f == 6200) { return 'fal fa-cloud-sleet' }
      else if (f == 6000) { return 'far fa-cloud-drizzle' }
      else if (f == 7101) { return 'fas fa-cloud-hail' }
      else if (f == 7000) { return 'fas fa-cloud-hail-mixed' }
      else if (f == 7102) { return 'far fa-cloud-hail-mixed' }
      else if (f == 5101) { return 'fas fa-cloud-snow' }
      else if (f == 5000) { return 'far fa-cloud-snow' }
      else if (f == 5100) { return 'fal fa-cloud-snow' }
      else if (f == 5001) { return 'fas fa-snowflakes' }
      else if (f == 8000) { return 'far fa-thunderstorm' }
      else if (f == 4201) { return 'fas fa-cloud-rain' }
      else if (f == 4001) { return 'fas fa-cloud-sun-rain' }
      else if (f == 4200) {
        return (isDay) ? 'far fa-cloud-sun-rain' : 'far fa-cloud-moon-rain'
      } else if (f == 4000) { return 'fas fa-cloud-drizzle' }
      else if (f == 2100) { return 'fal fa-fog' }
      else if (f == 2000) { return 'fad fa-fog' }
      else if (f == 1001) { return 'fad fa-clouds' }
      else if (f == 1102) { return 'fas fa-cloud' }
      else if (f == 1101) {
        return (isDay) ? 'fas fa-clouds-sun' : 'fas fa-clouds-moon'
      } else if (f == 1100) {
        return (isDay) ? 'fas fa-cloud-sun' : 'fas fa-cloud-moon'
      } else if (f == 1000) {
        return (isDay) ? 'fad fa-sun' : 'fad fa-moon-stars'
      }
      return 'fad fa-question';
    },
    codeToStr: function(w) {
      var code = w.values.weatherCode;
      var codeKey =  {
        0: "Unknown", 1000: "Clear",1001: "Cloudy",
        1100: "Mostly Clear",1101: "Partly Cloudy",1102: "Mostly Cloudy",
        2000: "Fog",2100: "Light Fog",3000: "Light Wind",
        3001: "Wind",3002: "Strong Wind",4000: "Drizzle",
        4001: "Rain",4200: "Light Rain",4201: "Heavy Rain",
        5000: "Snow",5001: "Flurries",5100: "Light Snow",
        5101: "Heavy Snow",6000: "Freezing Drizzle",6001: "Freezing Rain",
        6200: "Light Freezing Rain",6201: "Heavy Freezing Rain",7000: "Ice Pellets",
        7101: "Heavy Ice Pellets",7102: "Light Ice Pellets",8000: "Thunderstorm"
      };
      return codeKey[code];
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
              '<td alt="'+ui.weather.codeToStr(w)+'"> '+
              '<div class="hourly-item" '+
                'data-toggle="tooltip" '+
                'data-html="true" '+
                'data-placement="top" '+
                'v-b-tooltip.hover.viewport '+
                'title="'+ui.weather.generate.forecast.hourlyDetail(w)+'"'+
              '>'+
                '<p class="time">'+time+'</p>'+
                '<i class="'+ui.weather.selectIcon(w)+'"></i>'+
                '<p class="wind">'+
                  w.values.windSpeed.toFixed(0)+
                  ' '+app.units.speed()+
                  ' '+app.strFormat.degreesToBearing(w.values.windDirection)+
                '</p>'+
                '<p class="temp">'+
                  w.values.temperature.toFixed(0)+'°'+app.units.temp()+
                '</p>'+
              '</div></td>'
            );
          });
        },
        //creates the tooltips when tapped
        hourlyDetail: function(x) {
          return '<p>'+ui.weather.codeToStr(x)+'</p>' +
            '<p>Wind: '+x.windSpeed+' '+app.units.speed()+'</p>';
        },
        //generate the daily table.
        //also generates the popup when clicking for details
        daily: function(forecast) {
          forecast.forEach(function(f){
            var day = app.strFormat.weekday(f.startTime);
            var tempUnits = app.units.temp();
            $('#daily-forecast').append(
              '<tr onclick="popup.open(\''+ //popup content
                        ui.weather.generate.detail.daily(f)+
                        '\')" class="hover-pointer">' +
                '<td>'+day+'</td>'+
                '<td><i class="'+ui.weather.selectIcon(f)+'"></i></td>'+
                '<td>'+f.values.temperatureMin.toFixed(0)+'°'+tempUnits+'</td>'+
                '<td>'+f.values.temperatureMax.toFixed(0)+'°'+tempUnits+'</td>'+
              '</tr>'
            )
          })
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
        daily: function(day) {
          buffer = '';
          buffer += '<h4>'+app.strFormat.weekday(day.startTime)+'</h4>';
          buffer += '<p>'+app.strFormat.genDesc(day)+'</p><br/>';
          buffer += '<table>';
          if (day.visibility) {
            buffer+= '<tr></tr>';
          }
          buffer+= '</table>';


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
      //weather.getAll();
      var favorites = maps.favorites.get();
      $('#favorites-list').html('');
      favorites.forEach(function(location) {
        ui.favorites._createLocationEntry(
          location.name,
          'weather.cache(\'last\',{}); weather.get({lat:'+location.lat+',lng:'+location.lng+'});'
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
  },
  settings: {
    //called when opening the page
    loadContext: function() {
      ui.settings.onlineMode.genToggle();
      ui.settings.units.genToggle();
    },
    //refers to the onlinemode toggle btn
    onlineMode: {
      //defines what JS is run when the onlinemode toggle button
      //is toggled on and off
      genToggle: function() {
        general.createToggle(
          '#cached-mode-toggle', //parentElement
          !(app.devMode.isEnabled()), //isToggled
          function() { //Toggle off callback
            app.devMode.enable();
          },
          function() { //Toggle on callback
            app.devMode.disable();
          }
        )
      }
    },
    units: {
      genToggle: function() {
        general.createToggle(
            '#units-toggle', //parentElement
            (app.settings().units == 'metric'), //isToggled
            function() { //Toggle off callback
              app.settings('units','imperial');
              app.storage('weatherCache',{});
              app.refresh();
            },
            function() { //Toggle on callback
              app.settings('units','metric');
              app.storage('weatherCache',{});
              app.refresh();
            }
          )
      }
    },
    debug: {
      weatherData: function() {
        popup.open('<div style="text-align:left; width:100%"> <pre style="color:#fff">' + JSON.stringify(weather.cache(),null,'  ') + '</pre></div>');
      },
      weatherTiming: function() {
        var buffer = '';
        Object.keys(weather.cache()).forEach(function(key){
          if (key != 'last') {
            var timing = weather.cache()[key].w.timing;
            var city = weather.cache()[key].w.OWM.name
            buffer += '<h3>'+city+'</h3>';
            buffer += '<p>Client: '+timing.client.toFixed(3)+'s</p>';
            buffer += '<p>Server: '+timing.serverTotal.toFixed(3)+'s</p>';
            buffer += '<p>TX/RX: '+timing.tx_rx.toFixed(3)+'s</p>';
            buffer += '<p>Daily: '+timing.daily.toFixed(3)+'s</p>';
            buffer += '<p>Hourly: '+timing.hourly.toFixed(3)+'s</p>';
            buffer += '<p>OWM: '+timing.OWM.toFixed(3)+'s</p>';
            buffer += '<hr/><br/>';
          }
        });
        popup.open(buffer)

      }
    }
  }
}
