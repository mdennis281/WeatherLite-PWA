var uiWeather = {
    //Called on weather page load
    //waits until the weather object is finished
    //loading. When it is, it will move onto ui.weather._render()
    render: function (callback) {
      weather.getQueued(function(wData){
        ui.weather._render(wData.w);
        callback();
      });
    },

    //Renders the webpage with data retrieved from weather.getQueued()
    _render: function(wData) {

      var todayI = ui.weather.getTodayIndex(wData.daily);
      var now = wData.hourly[0];
      var today = wData.daily[todayI];
      ui.weather.generate.radar(wData.call);
      ui.weather.generate.forecast.hourly(wData.hourly.slice(0, 23));
      ui.weather.generate.forecast.daily(wData.daily.slice(todayI, todayI+6));

      $('#detailed-forecast-today').html(
        txtFormat.genDesc(today)
      );
      $('#temperature').html(
        now.values.temperature.toFixed(0)+ '°' + app.units.temp()
      );
      $('#city').html(
        maps.coord2Name(wData.call.latitude,wData.call.longitude,wData)
      );
      $('#condition').html(ui.weather.codeToStr(now));
      $('#sunrise-time').html(
        txtFormat.hourMin(wData.OWM.sys.sunrise*1000)
      );
      $('#sunset-time').html(
        txtFormat.hourMin(wData.OWM.sys.sunset*1000)
      );
      $('#humidity').html(
        wData.OWM.main.humidity + '%'
      );
      $('#visibility').html(
        now.values.visibility.toFixed(1) + ' ' + app.units.dist()
      );
      $('#loader-container').remove();
      $('#weather-content').removeClass('div-hide');
    },

    // get today's index from w obj 
    // noticed it pulls data from yesterday sometimes
    getTodayIndex: function(days) {
      var i = 0
      var today = (new Date()).getDate();
      try {
        while((new Date(days[i].startTime).getDate() != today)) {
          i++;
        }
        return i;
      } 
      //if didnt find
      catch (TypeError) {
        DEBUG('getTodayIndex FAIL');
        return 0;
      }
      
    },

    //Logic to determine which icon to display for the user.
    //Used for both hourly and daily forecasts
    selectIcon: function(w) {
      var f = w.values.weatherCode;
      var isDay = txtFormat.isDaytime(w.startTime);

      if (f == 6201) { return 'fas fa-cloud-sleet' }
      else if (f == 6001) { return 'far fa-cloud-sleet' }
      else if (f == 6200) { return 'fal fa-cloud-sleet' }
      else if (f == 6000) { return 'far fa-cloud-drizzle' }
      else if (f == 7101) { return 'fas fa-cloud-hail' }
      else if (f == 7000) { return 'fas fa-cloud-hail-mixed' }
      else if (f == 7102) { return 'far fa-cloud-hail-mixed' }
      else if (f == 5101) { return 'far fa-igloo' }
      else if (f == 5000) { return 'far fa-cloud-snow' }
      else if (f == 5100) { return 'fal fa-cloud-snow' }
      else if (f == 5001) { return 'fad fa-snowflakes' }
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
            var time = txtFormat.hour(w.startTime);
            if (!i) {time = 'Now'}
            $('#hourly-forecast').append(
              `
              <td alt="${ui.weather.codeToStr(w)}>
                <div 
                  class="hourly-item"
                  data-toggle="tooltip"
                  data-html="true"
                  data-placement="top"
                  v-b-tooltip.hover.viewport
                  title="${ui.weather.generate.forecast.hourlyDetail(w)}"
                >
                  <p class="time">${time}</p>
                  <i class="${ui.weather.selectIcon(w)}"></i>
                  <p class="rain">
                    ${w.values.precipitationProbability}%
                  </p>
                  <p class="wind">
                    ${w.values.windSpeed.toFixed(0)} ${app.units.speed()} ${txtFormat.degreesToBearing(w.values.windDirection)}
                  </p>
                  <p class="temp">
                    ${w.values.temperature.toFixed(0)}°${app.units.temp()}
                  </p>
                </div>
              </td>
              `
            );
          });
        },
        //creates the tooltips when tapped
        hourlyDetail: function(x) {
          return '<p>'+ui.weather.codeToStr(x)+'</p>' +
            '<p>Wind: '+x.values.windSpeed.toFixed(0)+' '+app.units.speed()+'</p>';
        },
        //generate the daily table.
        //also generates the popup when clicking for details
        daily: function(forecast) {
          forecast.forEach(function(f){
            var day = txtFormat.weekday(f.startTime);
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
          buffer += '<h4>'+txtFormat.weekday(day.startTime)+'</h4>';
          buffer += '<p>'+txtFormat.genDesc(day)+'</p><br/>';
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
  }