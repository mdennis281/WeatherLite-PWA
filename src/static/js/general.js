var general = {
  /*
    Desc: Creates a toggle button using fontawesome icons
    Args:
      parentElement: string of element selector (CSS format)
      isToggled: boolean to determine the starting state
      onCallback: function to execute when toggle is flipped on
      offCallback: function to execute when toggle is flipped off
  */
  createToggle: function(parentElement,isToggled,onCallback,offCallback) {
    var ids = {
      on:'toggleOn-'+general.randInt(),
      off:'toggleOff-'+general.randInt()
    }
    var onBtn= '<i id="'+ids.on+'"'+
              ' class="fad fa-toggle-on createToggle-on"></i>';
    var offBtn= '<i id="'+ids.off+'"'+
              ' class="fad fa-toggle-off createToggle-off"></i>';
    $(parentElement).addClass('toggle-container');
    $(parentElement).html(onBtn+offBtn);
    [
      {'this':'#'+ids.on ,'callback':onCallback ,'other':'#'+ids.off},
      {'this':'#'+ids.off,'callback':offCallback,'other':'#'+ids.on }
    ].forEach(function(data){
      $(data.this).click(function(){
        $(data.this).animateCss('fadeOut',function(){
          $(data.this).addClass('div-hide');
        })
        $(data.other).removeClass('div-hide').animateCss('fadeIn');
        data.callback();
      });
    });
    if (isToggled) {
      $('#'+ids.off).addClass('div-hide');
    } else {
      $('#'+ids.on).addClass('div-hide');
    }
  },
  randInt: function(max=9999) {
    return Math.floor(Math.random() * Math.floor(max));
  }


}

/*
  Desc: Extends animateCss into jQuery
  Usage: $('#element').animateCss('animationName','callback')
*/
$.fn.extend({
  animateCss: function(animationName, callback) {
    var animationEnd = (function(el) {
      var animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
      };

      for (var t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement('div'));

    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);

      if (typeof callback === 'function') callback();
    });

    return this;
  },
});
