//Popup screen used to prompt a user with info
//Dependencies:
//    /static/css/popup.css
var popup = {
  open: function(content) {
    $('#popup-body').html(content);
    $('#popup').removeClass('div-hide');
    $('#popup-bg').animateCss('fadeIn');
    $('#popup-body').animateCss('zoomIn');
  },
  close: function() {
    $('#popup-bg').animateCss('fadeOut');
    $('#popup-body').animateCss('zoomOut',function(){
      $('#popup-body').html('');
      $('#popup').addClass('div-hide');
    });
  }
}
