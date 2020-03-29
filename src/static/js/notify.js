
$.notifyDefaults({
	allow_dismiss: true,
	delay: 500000,
  showProgressbar: true,
  offset: 5,
  placement: {
		from: "top",
    align: "right"
	},
	animate:{
		enter: "animated fadeInDown",
		exit: "animated fadeOutUp"
	}
});

var n = {
  info: function(title,message,callback) {
    $.notify({
      title: title,
      message: message
    },{
      type: "info",
      template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" onClick="'+callback+'" role="alert">' +
    		'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
    		'<i class="fad fa-info-circle"></i>' +
    		'<span class="" data-notify="title">{1}</span> ' +
    		'<span class="" data-notify="message">{2}</span>' +
    		'<div class="progress" data-notify="progressbar">' +
    			'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
    		'</div>' +
      '</div>'
    })
  }
}

/*
$.notify.addStyle('default', {
  html: "<div><span data-notify-html/></div>",
  classes: {
    base: {
      "background-color": "#1C2541",
      "padding": "5px",
      "top": "0",
      "left": "0",
      "width": "100%",
      "color": "#ccc",
      "border": "1px solid #555",
      "border-radius": "3px",
      "text-align": "center",

    },
    superblue: {
      "color": "white",
      "background-color": "blue"
    }
  }
});
*/
