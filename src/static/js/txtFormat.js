var txtFormat = {
    hourMin: function(date) {
      var dt = (new Date(date));
      var hr = (dt.getHours() > 12) ? (dt.getHours()-12) : dt.getHours();
      var min = (dt.getMinutes() < 10) ? '0'+dt.getMinutes() : dt.getMinutes();
      var am_pm = (dt.getHours()>11) ? 'PM' : 'AM';
      return hr + ':' + min + ' ' + am_pm;
    },
    hour: function(date) {
      var dt = (new Date(date));
      var hr = (dt.getHours() > 12) ? (dt.getHours()-12) : dt.getHours();
      var am_pm = (dt.getHours()>11) ? 'PM' : 'AM';
      if (hr == 0) hr = 12 //if midnight
      return hr + ' ' + am_pm;
    },
    weekday: function(dateStr) {
      var weekdays = [
        "Sunday", "Monday", "Tuesday",
        "Wednesday", "Thursday", "Friday", "Saturday"
      ]
      var date = (new Date(dateStr));
      if (dateStr.includes('T')){
        return weekdays[date.getDay()];
      } else {
        return weekdays[date.getUTCDay()];
      }

      return str.split(' ')[0];
    },
    isDaytime: function(date) {
      if (date.includes('T')) {
        var dateHrs = (new Date(date)).getHours();
        if (dateHrs < 6 || dateHrs > 18) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    degreesToBearing: function(x,full) {

      if (x<=22.5 || x>=337.5) {
        return (full) ? 'North' : 'N';
      } else if (x<=67.5) {
        return (full) ? 'Northeast' : 'NE';
      } else if (x<=112.5) {
        return (full) ? 'East' : 'E';
      } else if (x<=157.5) {
        return (full) ? 'Southeast' : 'SE';
      } else if (x<=202.5) {
        return (full) ? 'South' : 'S';
      } else if (x<=247.5) {
        return (full) ? 'Southwest' : 'SW';
      } else if (x<=292.5) {
        return (full) ? 'West' : 'W';
      } else if (x<337.5) {
        return (full) ? 'Northwest' : 'NW';
      } else {
        return 'ERROR';
      }
    },
    windSpeed: function(w) {
      var units = app.units.speed();
      var min = w.values.windSpeed.toFixed(0);
      var max = w.values.windGust.toFixed(0);
      return min + '-' + max + ' ' + units;
    },
    temp: function(w) {
      var units = app.units.temp();
      var min = w.values.temperatureMin.toFixed(0);
      var max = w.values.temperatureMax.toFixed(0);
      return min + '°-' + max + '°' + units;
    },
    genDesc: function(w) {
      var desc = txtFormat.weekday(w.startTime)+'\`s';
      desc += ' forecast shows ' + ui.weather.codeToStr(w) + ' with temperatures';
      desc += ' ranging between ' + txtFormat.temp(w)+'. ';
      if (w.values.precipitationProbability) {
        var pp = w.values.precipitationProbability +'%';
        //var pt = txtFormat.hour(w.precipitation[0].observation_time);
        desc += 'There is a '+pp+' chance of rain today. ';
      }
      if (w.values.windSpeed) {
        desc += 'Winds from the ' + txtFormat.degreesToBearing(w.values.windDirection,true);
        desc += ' blowing between ' + txtFormat.windSpeed(w)+ '. ';
      }
      return desc;
    },
    avgValues: function(data,withUnits=false) {
      if (data.length = 2) {
        var units = data[0].min.units;
        var min = data[0].min.value;
        var max = data[1].max.value;
        var avg = ((min+max)/2).toFixed(0);
        return avg + ((withUnits)? ' '+units : '');
      } else {
        var w = data[0];
        if (w.min) {
          return w.min.value
        } else {
          return w.max.value
        }
      }
    }
  }