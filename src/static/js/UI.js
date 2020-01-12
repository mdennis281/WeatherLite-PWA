var ui = {
  weather: {
    render: function () {
      if (weather.isLoading) {
        setTimeout(function(){ui.weather.render();},100);
      } else {
        ui.weather._render(weather.lastFetch);
      }
    },

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
        weather.lastFetch.OWM.main.humidity + '%'
      );
      $('#visibility').html(
        Math.round(weather.lastFetch.OWM.visibility/1609.34) + ' mi' //todo locality
      )
      $('#loader-container').remove();
      $('#weather-content').removeClass('div-hide');
    },

    selectIcon: function(w) {
      var f = w.shortForecast;
      if (f.match(/Sunny|Clear/)) {
        if (w.isDaytime) {
          return 'fas fa-sun';
        } else {
          return 'fas fa-moon';
        }
      }
      if (f.match(/Snow|Flurry|Flurries/)) {
        return 'fas fa-snowflake';
      }
      if (f.match(/Rain|Showers|Thunder|Lightning|Drizzle/)) {
        if (f.match(/(Scattered|Light|Slight|Patchy)/)) {
          if (w.isDaytime) {
            return 'fas fa-cloud-sun-rain';
          } else {
            return 'fas fa-cloud-moon-rain';
          }
        } else {
          return 'fas fa-cloud-showers-heavy';
        }
      }
      if (f.match(/Cloud/)) {
        if (f.match(/Part/)) {
          if (w.isDaytime) {
            return 'fas fa-cloud-sun';
          } else {
            return 'fas fa-cloud-moon';
          }
        } else {
          return 'fas fa-cloud';
        }
      }
      return 'fas fa-question';
    },

    generate: {
      forecast: {
        hourly: function(forecast) {
          forecast = forecast.slice(0,24);
          forecast.forEach(function(w,i){
            var time = app.strFormat.hour(w.startTime);
            if (!i) {time = 'Now'}
            $('#hourly-forecast').append(
              '<td>'+
                '<p class="time">'+time+'</p>'+
                '<i class="'+ui.weather.selectIcon(w)+'" alt="'+w.shortForecast+'"></i>'+
                '<p class="wind">'+w.windSpeed+'</p>'+
                '<p class="temp">'+w.temperature+'°</p>'+
              '</td>'
            );
          });
        },
        daily: function(forecast) {
          var i;
          for (i=0; i < forecast.length; i+=2) {
            DEBUG(forecast[i].shortForecast);
            $('#daily-forecast').append(
              '<tr onclick="popup.open(\''+
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
      radar: function(coords) {
        var url = 'https://maps.darksky.net/@precipitation_rate,'+
                  coords.latitude+','+coords.longitude+',10'

        $('#radar-container .body').html('<iframe src="'+url+'" />')
      },
      detail: {
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
      open: function() {
        $('#radar-container').removeClass('div-hide');
        $('#radar-container .body iframe').focus();
      },
      close: function() {
        $('#radar-container').addClass('div-hide');
        $('#weather-content').focus();
      }
    }
  },
}
