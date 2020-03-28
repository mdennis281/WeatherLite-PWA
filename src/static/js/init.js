

function DEBUG(message){
  if (cookie.get('devMode')) {
    console.info(message);
  }
}

var assetLoader = {
  JSLoadCount: 0,
  JSBuffer: [],
  JS: function(files,i=0) {

    var file = files[i]

    fileStorage.get(file,function(content){
      assetLoader.JSBuffer[i] =
      '\n<!-- ||||||||||     '+file+'     |||||||||| -->\n'+
      '\n<script>\n'+
        content+
      '</script>';
      assetLoader.JSLoadCount++;

    });

    if (files.length != i+1){
      assetLoader.JS(files,i+1);
    } else {
      startApp();

    }

  },
  CSS: function(files,callback) {

    var file = files.pop();

    fileStorage.get(file,function(rule){
      let css = document.createElement('style');
      css.type = 'text/css';
      if (css.styleSheet) css.styleSheet.cssText = rule; // Support for IE
      else css.appendChild(document.createTextNode(rule)); // Support for the rest
      document.getElementsByTagName("head")[0].appendChild(css);
    });

    if (files.length){
      assetLoader.CSS(files,callback);
    } else {
      if (typeof callback === 'function') callback();
    }

  }
}

var fileStorage = {
  get: function(file,callback) {
    var content = localStorage.getItem('FILESTORAGE-'+file);
    //if file in localstorage and devmode not enabled
    if (content && (!cookie.get('devMode'))) {
      DEBUG('Loaded From LocalStorage: ' + file)
      callback(content);
    } else {
      fileStorage.fetch(file,callback);
      DEBUG('Loaded From Web: ' + file)
    }
  },
  cache: function(name,script) {
    localStorage.setItem(name,script)
  },
  fetch: function(URL,callback) {
    $.get(URL+'?_=' + new Date().getTime(), function(data) {
      fileStorage.cache('FILESTORAGE-'+URL,data);
      callback(data);
    },null,'text');
  }
}

var cookie =  {
  get: function(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  },
  set: function(name,value,days) {
    var expires = "";
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  },
  delete: function(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
  }
}



//Service Worker Registration (PWA)
if('serviceWorker' in navigator) {
  navigator.serviceWorker
  .register('/worker.js')
  .then(function() {
    DEBUG("Service Worker registered successfully");
  })
  .catch(function() {
    DEBUG("Service worker registration failed");
  });
}

function startApp(count=1) {
  function retry() {
    setTimeout(function(){startApp(count+1)},1000);
  }

  if (assetLoader.JSLoadCount == Files.JSLength) {
    if (!$('#scripts').html()){
      assetLoader.JSBuffer.forEach(function(script){
        $('#scripts').append(
          script
        );
      });
    }
    $('document').ready(function(){
      try {
        app.start();
        DEBUG('Started App.');
      } catch {
        DEBUG('Start Failed-- Retrying ('+String(count)+')')
        retry();
      }
    });
  } else { retry(); }
}

$(window).on('popstate', function() {
  return '';
})
$(window).on('pushstate', function() {
  return '';
})
