var popup = {
  open: function(content) {
    $('#popup-body').html(content);
    $('#popup').removeClass('div-hide');
  },
  close: function() {
    $('#popup-body').html('');
    $('#popup').addClass('div-hide');
  }
}
