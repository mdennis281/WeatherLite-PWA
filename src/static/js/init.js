

//WeatherLite Console Banner
console.log(" __      __                   __    __                      \n/\\ \\  __/\\ \\                 /\\ \\__/\\ \\                     \n\\ \\ \\/\\ \\ \\ \\     __     __  \\ \\ ,_\\ \\ \\___      __   _ __  \n \\ \\ \\ \\ \\ \\ \\  /'__`\\ /'__`\\ \\ \\ \\/\\ \\  _ `\\  /'__`\\/\\`'__\\\n  \\ \\ \\_/ \\_\\ \\/\\  __//\\ \\L\\.\\_\\ \\ \\_\\ \\ \\ \\ \\/\\  __/\\ \\ \\/ \n   \\ `\\___x___/\\ \\____\\ \\__/.\\_\\\\ \\__\\\\ \\_\\ \\_\\ \\____\\\\ \\_\\ \n    '\\/__//__/  \\/____/\\/__/\\/_/ \\/__/ \\/_/\\/_/\\/____/ \\/_/ \n                                                            \n                                                            \n __           __                                            \n/\\ \\       __/\\ \\__                                         \n\\ \\ \\     /\\_\\ \\ ,_\\    __                                  \n \\ \\ \\  __\\/\\ \\ \\ \\/  /'__`\\                                \n  \\ \\ \\L\\ \\\\ \\ \\ \\ \\_/\\  __/                                \n   \\ \\____/ \\ \\_\\ \\__\\ \\____\\                               \n    \\/___/   \\/_/\\/__/\\/____/                               \n                                                            \n                                                            ");

// console.logs messages if devmode is enabled
function DEBUG(message){
  if (cookie.get('devMode')) {
    console.info(message);
  }
}

//Caches files to localstorage
//Not really used anymore since
//Moved over to google's PWA caching standard
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

//A solution to get and set non-private cookies
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
  },
   purge: function() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
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

//related to setting behavior of forward and back buttons
//I dont think this does anything (at the time of me making these comments)
//but I also dont want to break anything, so here they are
$(window).on('popstate', function() {
  return '';
})
$(window).on('pushstate', function() {
  return '';
})
