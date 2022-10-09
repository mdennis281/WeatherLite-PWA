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
    if (!app.settings().units) app.settings('units','imperial');
    weather.initialize();
    app.updateCheck();
    app.errorCheck();
    app.page.selectStart();
    app.logIP();
    app.showStartupMsgs();
  },

  updateCheck: function() {
    $.get('/API/app/version',function(data){
      var v = app.settings().version;
      app.settings('version',data.version);
      if (v) {
        if (v != data.version) {
          app.clearCache(0);
          cookie.purge();
          app.queueStartupMsg(
            `App Updated to Version: ${data.version}`,
            'Pretty seamless experience, right? ;)'
          );
          app.refresh();
        }
      }
    });

  },
  /*
    checking for version issues with the application
    some of the updates to APIs etc have required changes
    that would break the app if old configs existed clientside
  */
  errorCheck: function() {
    if (!['metric','imperial'].includes(app.settings().units)){
        app.settings('units',device.unitLocale());
    };
    if (!app.storage('StartupMessage')) {
      app.storage('StartupMessage',[]);
    };
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
      var desc = app.strFormat.weekday(w.startTime)+'\`s';
      desc += ' forecast shows ' + ui.weather.codeToStr(w) + ' with temperatures';
      desc += ' ranging between ' + app.strFormat.temp(w)+'. ';
      if (w.values.precipitationProbability) {
        var pp = w.values.precipitationProbability +'%';
        //var pt = app.strFormat.hour(w.precipitation[0].observation_time);
        desc += 'There is a '+pp+' chance of rain today. ';
      }
      if (w.values.windSpeed) {
        desc += 'Winds from the ' + app.strFormat.degreesToBearing(w.values.windDirection,true);
        desc += ' blowing between ' + app.strFormat.windSpeed(w)+ '. ';
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
    Stores a message to display next time the app is loaded.
    usage:
      app.queueStartupMessage(
        'A startup message',
        'Shown next time the app is loaded'
      )
  */
  queueStartupMsg: function (title,msg) {
    var msgs = app.storage('StartupMessage');
    msgs.push({
      'title': title,
      'message': msg
    });
    app.storage(
      'StartupMessage',
      msgs
    );
  },
  /*
    Loaded on init to show most recent startup msgs
    usage:
      app.showStartupMsgs();
  */
  showStartupMsgs: function () {
    var msgs = app.storage('StartupMessage');
    msgs.forEach(function(msg) {
      n.info(msg.title,msg.message);
    });
    app.storage('StartupMessage',[]);
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
  },
  units: {
    dist:  function() { return (app.settings()['units'] == 'metric') ? 'km' : 'mi'},
    temp:  function() { return (app.settings()['units'] == 'metric') ? 'C' : 'F'},
    speed: function() { return (app.settings()['units'] == 'metric') ? 'kmph' : 'mph'},
  }
}
