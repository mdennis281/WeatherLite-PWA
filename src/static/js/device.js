//Device detection script
//Doesnt work perfectly for mobile- but it's the most in depth
//ive found to date

//Extenal calls:
//    device.getOS()
//    device.getBrowser()

var device = {
  getOS: function() {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'MacOS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }

    return os;
  },
  getBrowser: function() {
    if (browser.isOpera) {
      return "Opera"
    } else if (browser.isFirefox) {
      return "Firefox"
    } else if (browser.isIE) {
      return "IE"
    } else if (browser.isEdge) {
      return "Edge"
    } else if (browser.isSafari) {
      return "Safari"
    } else if (browser.isChrome) {
      return "Chrome"
    } else if (browser.isBlink) {
      return "Blink"
    } else if (browser.isIOSSafari) {
      return "IOSSafari"
    } else {
      return "Unknown"
    }
  },
  isPWA: (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone) || document.referrer.includes('android-app://'),

  unitLocale: function() {
    var lang = window.navigator.language.toLowerCase();
    DEBUG('Browser Language: '+lang);
    if ("en-us" == lang) return 'imperial'; // USA
    if ("lt" == lang) return 'imperial'; // Liberia
    if ("my" == lang) return 'imperial'; // Myanmar
    return 'metric'
  }
}
var ua = window.navigator.userAgent;
var browser = {}
		browser.isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0; // Opera 8.0+
		browser.isFirefox = typeof InstallTrigger !== 'undefined'; // Firefox 1.0+
		browser.isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification)); // Safari 3.0+
		browser.isIE = /*@cc_on!@*/false || !!document.documentMode; // Internet Explorer 6-11
		browser.isEdge = !browser.isIE && !!window.StyleMedia; // Edge 20+
		browser.isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime); // Chrome 1+
    browser.isEdgeChromium = browser.isChrome && (navigator.userAgent.indexOf("Edg") != -1);
		browser.isBlink = (browser.isChrome || browser.isOpera) && !!window.CSS; // Blink engine detection
    browser.isIOSSafari = (!!ua.match(/iPad/i) || !!ua.match(/iPhone/i)) && !!ua.match(/WebKit/i) && !ua.match(/CriOS/i);
