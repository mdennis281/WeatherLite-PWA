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
              ' class="fad fa-toggle-on createToggle-on fa-3x"></i>';
    var offBtn= '<i id="'+ids.off+'"'+
              ' class="fad fa-toggle-off createToggle-off fa-3x"></i>';
    $(parentElement).html(onBtn+offBtn);
    [
      {'this':'#'+ids.on ,'callback':onCallback ,'other':'#'+ids.off},
      {'this':'#'+ids.off,'callback':offCallback,'other':'#'+ids.on }
    ].forEach(function(data){
      $(data.this).click(function(){
        $(data.this).addClass('div-hide');
        $(data.other).removeClass('div-hide');
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
