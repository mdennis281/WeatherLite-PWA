

//WeatherLite Console Banner
console.log(" __      __                   __    __                      \n/\\ \\  __/\\ \\                 /\\ \\__/\\ \\                     \n\\ \\ \\/\\ \\ \\ \\     __     __  \\ \\ ,_\\ \\ \\___      __   _ __  \n \\ \\ \\ \\ \\ \\ \\  /'__`\\ /'__`\\ \\ \\ \\/\\ \\  _ `\\  /'__`\\/\\`'__\\\n  \\ \\ \\_/ \\_\\ \\/\\  __//\\ \\L\\.\\_\\ \\ \\_\\ \\ \\ \\ \\/\\  __/\\ \\ \\/ \n   \\ `\\___x___/\\ \\____\\ \\__/.\\_\\\\ \\__\\\\ \\_\\ \\_\\ \\____\\\\ \\_\\ \n    '\\/__//__/  \\/____/\\/__/\\/_/ \\/__/ \\/_/\\/_/\\/____/ \\/_/ \n                                                            \n                                                            \n __           __                                            \n/\\ \\       __/\\ \\__                                         \n\\ \\ \\     /\\_\\ \\ ,_\\    __                                  \n \\ \\ \\  __\\/\\ \\ \\ \\/  /'__`\\                                \n  \\ \\ \\L\\ \\\\ \\ \\ \\ \\_/\\  __/                                \n   \\ \\____/ \\ \\_\\ \\__\\ \\____\\                               \n    \\/___/   \\/_/\\/__/\\/____/                               \n                                                            \n                                                            ");

// console.logs messages if devmode is enabled
function DEBUG(message){
  if (cookie.get('devMode')) {
    console.info(message);
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
