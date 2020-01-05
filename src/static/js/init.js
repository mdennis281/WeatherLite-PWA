

function DEBUG(message){
  if (debugEnabled) {
    console.info(message);
  }
}

var assetLoader = {
  JS: async function(files,callback) {
    await files.forEach(async function(file){
      await fileStorage.get(file,async function(content){
        eval(content);
      });
    });
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
  }
}

var fileStorage = {
  get: function(file,callback) {
    var content = localStorage.getItem('FILESTORAGE-'+file);
    if (content) {
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
    $.get(URL+'?_=' + new Date().getTime(),function(data) {
      fileStorage.cache('FILESTORAGE-'+URL,data);
      callback(data);
    })
  }
}


//Service Worker Registration (PWA)
if('serviceWorker' in navigator) {
  navigator.serviceWorker
  .register('/worker.js')
  .then(function() {
    console.log("Service Worker registered successfully");
  })
  .catch(function() {
    console.log("Service worker registration failed");
  });
}

function startApp() {
  try {
    app.start();
  } catch {
    setTimeout(function(){startApp()},100);
  }
}
