var errorLogger = {
  send: function (message,url,line) {
    $.post(
      '/errorLogger',

      {
        message: message,
        url: url,
        line: line
      }
    )
  }
}


window.onerror = function(message, url, line, column, errorOlb) {
  errorLogger.send(message,url,line);
  console.log(error)
  return true;
};
