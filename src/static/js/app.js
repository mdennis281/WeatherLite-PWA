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
    app.updateCheck();
    app.page.selectStart();
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
    weekday: function(date) {
      var str = (new Date(date)).toLocaleTimeString([],
        {weekday: 'long',}
      );
      return str.split(' ')[0];
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
      return (settings) ? settings : {};
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
        return JSON.parse(localStorage['APPSTORAGE-'+key]);
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

}
