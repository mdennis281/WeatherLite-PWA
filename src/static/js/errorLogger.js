var errorLogger = {
  send: function (message,url,line) {
    $.post(
      '/errorLogger',

      {
        message: message,
        url: url,
        line: line
      },
      function(data) {
        if (!data.success){
          DEBUG('Error Logging Failed. Server Error: ',data.error)
        }
      }, //onSuccess
      'json' //contentType
    )
  }
}


window.onerror = function(message, url, line, column, error) {
  errorLogger.send(message.replace('\n',''),url,line);
  console.log(message+'\n-'+url+'\n-'+line)
  return true;
};

function loop() {
setTimeout(function() { var n = null + 11 + [] +'afad' + xyz;},1000);
}
loop();
