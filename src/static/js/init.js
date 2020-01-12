

function DEBUG(message){
  if (cookie.get('devMode')) {
    console.info(message);
  }
}

var assetLoader = {
  finished: false,

  JS: async function(files,callback) {
    buffer = ''
    await files.forEach(async function(file){
      await fileStorage.get(file,async function(content){
        buffer += '\n\n\n'
              + '///////////   '+ file +'   //////////'
              + '\n\n\n'
              + content;
      });
    });
    buffer += '\n\n' + 'assetLoader.finished = true;';
    buffer = '<script>\n' + buffer + '\n</script>';
    $('#scripts').html(buffer);
    //eval(buffer);
    if (typeof callback === 'function') callback();
  },
  CSS: async function(files,callback) {
    await files.forEach(async function(file){
      await fileStorage.get(file,function(rule){
        let css = document.createElement('style');
        css.type = 'text/css';
        if (css.styleSheet) css.styleSheet.cssText = rule; // Support for IE
        else css.appendChild(document.createTextNode(rule)); // Support for the rest
        document.getElementsByTagName("head")[0].appendChild(css);
      });
    });
    if (typeof callback === 'function') callback();
  },
}

var fileStorage = {
  get: async function(file,callback) {
    var content = localStorage.getItem('FILESTORAGE-'+file);
    //if file in localstorage and devmode not enabled
    if (content && (!cookie.get('devMode'))) {
      DEBUG('Loaded From LocalStorage: ' + file)
      callback(content);
    } else {
      await fileStorage.fetch(file,callback);
      DEBUG('Loaded From Web: ' + file)
    }
  },
  cache: async function(name,script) {
    localStorage.setItem(name,script)
  },
  fetch: async function(URL,callback) {
    await $.get(URL+'?_=' + new Date().getTime(), async function(data) {
      await fileStorage.cache('FILESTORAGE-'+URL,data);
      callback(data);
    })
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
    setTimeout(function(){startApp(count+1)},100);
  }
  if (assetLoader.finished) {
    $('document').ready(function(){
      try {
        app.start();
      } catch {
        DEBUG('Start Failed-- Retrying ('+String(count)+')')
        retry();
      }
    });
  } else { retry(); }
}

$(window).on('popstate' function() {
  return '';
}
$(window).on('pushstate' function() {
  return '';
}
