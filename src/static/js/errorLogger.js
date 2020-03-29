var errorLogger = {
  send: function (message,url,line) {
    $.post(
      '/clientErrors/submit',

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

/*
window.onerror = function(message, url, line, column, error) {
  errorLogger.send(message.replace('\n',''),url,line);
  console.error(error)
  return true;
};
*/
