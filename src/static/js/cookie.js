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