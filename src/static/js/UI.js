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
      DEBUG('render');
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
      ui.weather.generate.forecast.hourly(wData.hourly);
      ui.weather.generate.forecast.daily(wData.daily);
      $('#detailed-forecast-today').html(
        app.strFormat.genDesc(today)
      );
      $('#temperature').html(
        now.temp.value.toFixed(0) + '°' + now.temp.units
      );
      $('#city').html(
        wData.OWM.name
      );
      $('#condition').html(ui.weather.codeToStr(now));
      $('#sunrise-time').html(
        app.strFormat.hourMin(today.sunrise.value)
      );
      $('#sunset-time').html(
        app.strFormat.hourMin(today.sunset.value)
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
      var f = w.weather_code.value;
      var isDay = app.strFormat.isDaytime(w.observation_time.value);

      if (f == 'freezing_rain_heavy') { return 'fas fa-cloud-sleet' }
      else if (f == 'freezing_rain') { return 'far fa-cloud-sleet' }
      else if (f == 'freezing_rain_light') { return 'fal fa-cloud-sleet' }
      else if (f == 'freezing_drizzle') { return 'far fa-cloud-drizzle' }
      else if (f == 'ice_pellets_heavy') { return 'fas fa-cloud-hail' }
      else if (f == 'ice_pellets') { return 'fas fa-cloud-hail-mixed' }
      else if (f == 'ice_pellets_light') { return 'far fa-cloud-hail-mixed' }
      else if (f == 'snow_heavy') { return 'fas fa-cloud-snow' }
      else if (f == 'snow') { return 'far fa-cloud-snow' }
      else if (f == 'snow_light') { return 'fal fa-cloud-snow' }
      else if (f == 'flurries') { return 'fas fa-snowflakes' }
      else if (f == 'tstorm') { return 'far fa-thunderstorm' }
      else if (f == 'rain_heavy') { return 'fas fa-cloud-rain' }
      else if (f == 'rain') { return 'fas fa-cloud-sun-rain' }
      else if (f == 'rain_light') {
        return (isDay) ? 'far fa-cloud-sun-rain' : 'far fa-cloud-moon-rain'
      } else if (f == 'drizzle') { return 'fas fa-cloud-drizzle' }
      else if (f == 'fog_light') { return 'fal fa-fog' }
      else if (f == 'fog') { return 'fad fa-fog' }
      else if (f == 'cloudy') { return 'fad fa-clouds' }
      else if (f == 'mostly_cloudy') { return 'fas fa-cloud' }
      else if (f == 'partly_cloudy') {
        return (isDay) ? 'fas fa-clouds-sun' : 'fas fa-clouds-moon'
      } else if (f == 'mostly_clear') {
        return (isDay) ? 'fas fa-cloud-sun' : 'fas fa-cloud-moon'
      } else if (f == 'clear') {
        return (isDay) ? 'fad fa-sun' : 'fad fa-moon-stars'
      }
      return 'fad fa-question';
    },
    codeToStr: function(w) {
      var f = w.weather_code.value;
      var isDay = app.strFormat.isDaytime(w.observation_time.value);

      if (f == 'freezing_rain_heavy') { return 'heavy freezing rain' }
      else if (f == 'freezing_rain') { return 'freezing rain' }
      else if (f == 'freezing_rain_light') { return 'light freezing rain' }
      else if (f == 'freezing_drizzle') { return 'freezing drizzle' }
      else if (f == 'ice_pellets_heavy') { return 'heavy hail' }
      else if (f == 'ice_pellets') { return 'hail' }
      else if (f == 'ice_pellets_light') { return 'light hail' }
      else if (f == 'snow_heavy') { return 'heavy snow' }
      else if (f == 'snow') { return 'snow' }
      else if (f == 'snow_light') { return 'light snow' }
      else if (f == 'flurries') { return 'snow flurries' }
      else if (f == 'tstorm') { return 'thunderstorms' }
      else if (f == 'rain_heavy') { return 'heavy rain' }
      else if (f == 'rain') { return 'rain' }
      else if (f == 'rain_light') {return 'light rain'}
      else if (f == 'drizzle') { return 'light drizzle' }
      else if (f == 'fog_light') { return 'light fog' }
      else if (f == 'fog') { return 'foggy skies' }
      else if (f == 'cloudy') { return 'cloudy skies' }
      else if (f == 'mostly_cloudy') { return 'mostly cloudy skies' }
      else if (f == 'partly_cloudy') { return 'partly cloudy skies' }
      else if (f == 'mostly_clear') { return 'mostly clear skies' }
      else if (f == 'clear') { return 'clear skies' }
      return f;
    },
    //called from ui.weather._render()
    generate: {
      forecast: {
        //creates the horizontal scrolling hourly forecast table
        hourly: function(forecast) {
          forecast = forecast.slice(0,24);
          forecast.forEach(function(w,i){
            var time = app.strFormat.hour(w.observation_time.value);
            if (!i) {time = 'Now'}
            $('#hourly-forecast').append(
              '<td alt="'+w.weather_code.value+'"> '+
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
                  w.wind_speed.value.toFixed(0)+
                  ' '+w.wind_speed.units+
                  ' '+app.strFormat.degreesToBearing(w.wind_direction)+
                '</p>'+
                '<p class="temp">'+w.temp.value.toFixed(0)+'°'+w.temp.units+'</p>'+
              '</div></td>'
            );
          });
        },
        //creates the tooltips when tapped
        hourlyDetail: function(x) {
          return '<p>'+x.weather_code.value+'</p>' +
            '<p>Wind: '+x.wind_speed.value+' '+x.wind_speed.units+'</p>';
        },
        //generate the daily table.
        //also generates the popup when clicking for details
        daily: function(forecast) {
          forecast.forEach(function(f){
            var day = app.strFormat.weekday(f.observation_time.value);
            $('#daily-forecast').append(
              '<tr onclick="popup.open(\''+ //popup content
                        ui.weather.generate.detail.daily(f)+
                        '\')" class="hover-pointer">' +
                '<td>'+day+'</td>'+
                '<td><i class="'+ui.weather.selectIcon(f)+'"></i></td>'+
                '<td>'+f.temp[0].min.value.toFixed(0)+'°'+f.temp[0].min.units+'</td>'+
                '<td>'+f.temp[1].max.value.toFixed(0)+'°'+f.temp[1].max.units+'</td>'+
              '</tr>'
            )
          })

          /*for (i=0; i < forecast.length; i+=2) {
            var day = app.strFormat.weekday(forecast[i].startTime);
            if (forecast[i].name.includes('night')) {
              var f1 = forecast[i];
              var f2 = null;
              i-=1;
              day = 'Overnight';
            } else {
              var f1 = forecast[i];
              var f2 = forecast[i+1];
            }
            if (f1) {
              $('#daily-forecast').append(
                '<tr onclick="popup.open(\''+ //popup content
                          ui.weather.generate.detail.daily(
                            f1,
                            f2
                          )+
                          '\')" class="hover-pointer">' +
                  '<td>'+day+'</td>'+
                  '<td><i class="'+ui.weather.selectIcon(f1)+'"></i></td>'+
                  '<td>'+f1.temperature+'°</td>'+
                  '<td>'+((f2) ? f2.temperature : '-')+'°</td>'+
                '</tr>'
              )
            }
          }*/
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
          buffer += '<h4>'+app.strFormat.weekday(day.observation_time.value)+'</h4>';
          buffer += '<h6>'+day.temp[0].min.value+'°'+day.temp[0].min.units+' - ';
          buffer += day.temp[1].max.value+'°'+day.temp[1].max.units+'</h6>';
          buffer += '<p>'+app.strFormat.genDesc(day)+'</p><br/>';
          if (day.wind_speed && day.wind_direction){
            buffer += '<p>Wind from the '+app.strFormat.degreesToBearing(day.wind_direction,true);
            buffer += ' blowing at '+app.strFormat.windSpeed(day.wind_speed);
            if (day.wind_gust) {
              buffer += ' gusting to '+app.strFormat.windSpeed(day.wind_gust);
            }
            buffer += '.</p>';
          }


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
            (app.settings().units == 'si'), //isToggled
            function() { //Toggle off callback
              app.settings('units','us');
              app.storage('weatherCache',{});
              app.refresh();
            },
            function() { //Toggle on callback
              app.settings('units','si');
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
        });
        popup.open(buffer)

      }
    }
  }
}
