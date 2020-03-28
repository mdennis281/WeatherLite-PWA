app = {
  start: function() {
    app.load.div('#nav','/parts/navbar');
    app.load.div('#popup','/parts/popup');
    app.page.select('weather');
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
          pageTriggers[option]();
          $('#nav-row .option').removeClass('selected');
          $('#'+option).addClass('selected');
          $('[data-toggle="tooltip"]').tooltip(); //popper
        });
      }

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
      var str = (new Date(date)).toLocaleTimeString([],
        {timeStyle: 'short',}
      );
      return str.replace(/:\d\d/,'');
    },
    weekday: function(date) {
      var str = (new Date(date)).toLocaleTimeString([],
        {weekday: 'long',}
      );
      return str.split(' ')[0];
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
  }

}
