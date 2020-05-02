//Defines notification settings for bootstrap notify

$.notifyDefaults({
	allow_dismiss: true,
	delay: 8000,
  showProgressbar: true,
  offset: 3,
  placement: {
		from: "top",
    align: ($(window).width() < 450) ? 'center' : 'right'
	},
	animate:{
		enter: "animated fadeInDown",
		exit: "animated fadeOutUp"
	}
});


//n.info() is a basic. informational popup themed for this application
var n = {
  info: function(title,message,callback) {
    $.notify({
      title: title,
      message: message
    },{
      type: "info",
      template: '<div data-notify="container" class="n-container n-info alert alert-{0}"  role="alert">' +
        '<div class="n-clickable" onclick="('+callback+')(); $.notifyClose();">'+
          '<div class="n-icon">'+
      		  '<i class="fad fa-info-circle fa-2x"></i>' +
          '</div>' +
          '<div class="n-body">'+
        		'<span class="" data-notify="title">{1}</span> ' +
        		'<span class="" data-notify="message">{2}</span>' +
          '</div>' +
        '</div>' +
        '<div class="n-dismiss" aria-hidden="true" class="close" data-notify="dismiss">'+
          '<i class="fas fa-times" ></i>' +
        '</div>' +
      	'<div class="progress" data-notify="progressbar">' +
    		  '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
    		'</div>' +
      '</div>'
    })
  }
}
