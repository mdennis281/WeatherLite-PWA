app = {
  title: 'WeatherLite',
  start: function() {
    app.load.div('#nav','/parts/navbar');
    app.load.div('#popup','/parts/popup');
    app.page.selectStart();
  },

  load: {
    div: function(div,content,callback){
      fileStorage.get(content,function(data) { //filestorage obj in init.js
        $(div).html(data);
        if (typeof callback === 'function') callback();
      });
    },
  },

  page: {
    select: function(option) {
       //if pressed option isnt already selected
      if (! $('#'+option).hasClass('selected')) {
        app.load.div('#page','/parts/'+option,function() {
          window.history.replaceState(option,app.title,'/?page='+option);
          pageTriggers[option]();
          $('#nav-row .option').removeClass('selected');
          $('#'+option).addClass('selected');
          $('[data-toggle="tooltip"]').tooltip(); //popper
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
      var min = dt.getMinutes();
      var am_pm = (dt.getHours()>11) ? 'PM' : 'AM';
      return hr + ':' + min + ' ' + am_pm;
    },
    hour: function(date) {
      var dt = (new Date(date));
      var hr = (dt.getHours() > 12) ? (dt.getHours()-12) : dt.getHours();
      var am_pm = (dt.getHours()>11) ? 'PM' : 'AM';
      return hr + ' ' + am_pm;
    },
    weekday: function(date) {
      var str = (new Date(date)).toLocaleTimeString([],
        {weekday: 'long',}
      );
      return str.split(' ')[0];
    }
  },
  settings: function(newData=null,value=null) {
    if (newData && value) {
      var settings = app.settings();
      settings[newData] = value;
      app.storage('settings',settings);
    } else if (newData && (!value)) {
      app.storage.set('settings',newData);
    } else {
      var settings = app.storage('settings');
      return (settings) ? settings : {};
    }
  },
  storage: function(key,data=null) {
    if (!data) {
      if (localStorage['APPSTORAGE-'+key]){
        return JSON.parse(localStorage['APPSTORAGE-'+key]);
      }
    } else {
      localStorage['APPSTORAGE-'+key] = JSON.stringify(data);
    }
  },

  clearCache: function() {
    var LS = Object.entries(localStorage);
    LS.forEach(function(entry) {
      if (entry[0].startsWith('FILESTORAGE-')) {
        localStorage.removeItem(entry[0]);
      }
    });
    $.notify(
      {title:"Cache Cleared.",message:"Press this notification to reload the app."},

    )
  },

  getQSP: function(key) {
    return (new URLSearchParams(window.location.search)).get(key);
  },

}
