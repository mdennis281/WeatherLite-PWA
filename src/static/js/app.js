/*
  the app object is the backbone to this PWA
    app.start():
      -loads in the appropriate divs
      -notifies user about PWA compatibility if on iOS
      -Checks for updates (reloads app if updates are available)
      -Chooses either the last open page, or opens the weather.
    app.refresh():
      -soft reloads the application
    app.page.select():
      -standardized way to load pages into the content div
      -highlights appropriate icon
      -executes page-specific JS
      -initializes tooltips
*/
app = {
  title: 'WeatherLite',
  start: function() {
    $('#app').addClass('div-hide');
    app.load.div('#nav','/parts/navbar');
    app.load.div('#popup','/parts/popup');
    $('#app').removeClass('div-hide');
    $('#app').animateCss('fadeIn',function(){
      PWANotify();
    });
    if (!app.settings().units) app.settings('units','us');
    app.updateCheck();
    app.page.selectStart();
    app.logIP();
  },

  updateCheck: function() {
    $.get('/API/app/version',function(data){
      var v = app.settings().version;
      app.settings('version',data.version);
      if (v) {
        if (v != data.version) {
          app.clearCache(0);
          app.refresh();
        }
      }
    });

  },

  load: {
    div: function(div,content,callback){
      fileStorage.get(content,function(data) { //filestorage obj in init.js
        $(div).html(data);
        if (typeof callback === 'function') callback();
      });
    },
  },

  refresh: function() {
    $('#app').animateCss('fadeOut',function(){
      $('#app').addClass('div-hide');
      location.reload(true);
    })
  },

  page: {
    select: function(option) {
       //if pressed option isnt already selected
      if (! $('#'+option).hasClass('selected')) {
        app.load.div('#page','/parts/'+option,function() {
          $('#page').scrollTop(0);
          // Sets page url
          window.history.replaceState(option,app.title,'/?page='+option);
          //removes navbar selected icon
          $('#nav-row .option').removeClass('selected');
          //adds correct selected icon
          $('#'+option).addClass('selected');
          //loads any page specific JS
          pageTriggers[option](function(){
            //tooltip loading
            $('[data-toggle="tooltip"]').tooltip();
          });
          //sets lastpage is the app is closed and re-opened
          app.settings('lastPage',option);
        });
      }
    },
    selectStart: function() {
      var startPage = 'weather';
      if (app.settings().keepState && app.settings().lastPage) {
        startPage = app.settings().lastPage;
      }
      startPage = (app.getQSP('page')) ? app.getQSP('page') : startPage;
      app.page.select(startPage);
    }
  },
  devMode: { //disables caching & logs events in consle
    enable: function() {
      cookie.set('devMode','1',9999);
      console.log('Developer Mode enabled.');
    },
    disable: function() {
      cookie.delete('devMode');
      console.log('Developer Mode disabled.');
    },
    isEnabled: function() {
      return (cookie.get('devMode')) ? true : false;
    }
  },

  strFormat: {
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
    degreesToBearing: function(wind_dir,full) {
      if(Array.isArray(wind_dir)){
        var min = wind_dir[0].min.value;
        var max = wind_dir[1].max.value;
        var x = (min+max)/2; //avg
      } else {
        var x = wind_dir.value;
      }

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
    windSpeed: function(wind) {
      if(Array.isArray(wind)){
        var units = wind[0].min.units;
        var min = wind[0].min.value.toFixed(0);
        var max = wind[1].max.value.toFixed(0);
        return min + '-' + max + ' ' + units;
      } else {
        var units = wind.units;
        var speed = wind.value.toFixed(0);
        return speed + ' ' + units;
      }
    },
    temp: function(temp) {
      if(Array.isArray(temp)){
        var units = temp[0].min.units;
        var min = temp[0].min.value.toFixed(0);
        var max = temp[1].max.value.toFixed(0);
        return min + '°-' + max + '°' + units;
      } else {
        var units = temp.units;
        var speed = temp.value.toFixed(0);
        return speed + ' ' + units;
      }
    },
    genDesc: function(w) {
      var desc = app.strFormat.weekday(w.observation_time.value)+'\`s';
      desc += ' forecast shows ' + ui.weather.codeToStr(w) + ' with temperatures';
      desc += ' ranging between ' + app.strFormat.temp(w.temp)+'. ';
      if (w.precipitation && w.precipitation_probability.value) {
        var pp = w.precipitation_probability.value +'%';
        var pt = app.strFormat.hour(w.precipitation[0].observation_time);
        desc += 'There is a '+pp+' chance of rain at '+pt+'. ';
      }
      if (w.wind_speed) {
        desc += 'Winds from the ' + app.strFormat.degreesToBearing(w.wind_direction,true);
        desc += ' blowing at ' + app.strFormat.windSpeed(w.wind_speed);
        if (w.wind_gust) {
          desc += ' gusting to '+app.strFormat.windSpeed(w.wind_gust);
        }
        desc += '. ';
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
  },
  /*
    Usage:
      settings()
        get all app settings as obj
      settings(key)
        get specific app setting
      settings(key,val)
        update specific app setting
  */
  settings: function(newData=null,value=null) {
    if (newData!=null && value!=null) {
      var settings = app.settings();
      settings[newData] = value;
      app.storage('settings',settings);
    } else if (newData!=null && !(value!=null)) {
      app.storage('settings',newData);
    } else {
      var settings = app.storage('settings');
      return (typeof settings === 'object') ? settings : {};
    }
  },
  /*
    uses localstorage to store various settings
    usage:
      app.storage(key)
        returns object
      app.storage(key,data)
        updates keyed object with data
  */
  storage: function(key,data=null) {
    if (!data) {
      if (localStorage['APPSTORAGE-'+key]){
        var r = JSON.parse(localStorage['APPSTORAGE-'+key]);
        return (typeof r === 'object') ? r : {};
      }
    } else {
      localStorage['APPSTORAGE-'+key] = JSON.stringify(data);
    }
  },
  /*
    attempted solution to clearing cache.
    behavior varies between browsers
  */
  clearCache: function(notification=1) {
    var LS = Object.entries(localStorage);
    LS.forEach(function(entry) {
      if (entry[0].startsWith('FILESTORAGE-')) {
        localStorage.removeItem(entry[0]);
      }
    });
    caches.delete('weatherlite');
    if (notification){
      n.info(
        'Cache Cleared.<br/>','Press here to reload the app.',
        function() { app.refresh() }
      );
    }

  },
  //gets QSP value from key
  getQSP: function(key) {
    return (new URLSearchParams(window.location.search)).get(key);
  },
  //logIP to cookie
  logIP: function() {
    var url = 'https://www.cloudflare.com/cdn-cgi/trace';
    $.get(url, function(resp){
      var outList = resp.split('\n');
      outList.forEach(function(row) {
        var [key,val] = row.split('=');
        if (key == 'ip') {
          DEBUG('Client IP logged as: '+val);
          cookie.set('clientIP',val);
        }
      });
      });
  }
}
