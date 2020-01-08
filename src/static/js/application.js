app = {
  start: function() {
    app.load.div('#nav','/parts/navbar');
    app.load.div('#page','/parts/weather');
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
      if (! $(option).hasClass('selected')) {
        $('#nav-row .option').removeClass('selected');
        $(option).addClass('selected');
        //TODO load page
      }

    }
  },
  devMode: { //disables caching & logs events in consle
    enable: function() {
      cookie.set('devMode','1',9999);
    },
    disable: function() {
      cookie.delete('devMode');
    }
  },

}
