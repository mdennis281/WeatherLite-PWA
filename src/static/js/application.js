app = {
  start: function() {
    app.load.div('#nav','/parts/navbar');
    app.load.div('#page','/parts/weather');
    app.load.div('#popup','/parts/popup');
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
        $('#nav-row .option').removeClass('selected');
        $('#'+option).addClass('selected');
        app.load.div('#page','/parts/'+option);
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
    }
  },

  strFormat: {
    hourMin: function(date) {
      return (new Date(date)).toLocaleTimeString([],
        {timeStyle: 'short', minute:'2-digit'}
      );
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

  horizontalScroll: function(outer,inner) {
    const viewport = document.querySelector(outer);
    const content = document.querySelector(inner);

    new ScrollBooster({
      viewport,
      content,
      direction: 'horizontal',
      onUpdate: (state) => {
        viewport.scrollLeft = state.position.x;
      }
    });
  }

}
