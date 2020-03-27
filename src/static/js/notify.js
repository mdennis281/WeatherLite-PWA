$.notifyDefaults({
	allow_dismiss: true,
	delay: 50000,
  showProgressbar: true,
  placement: {
		from: "top",
    align: "right"
	},
	animate:{
		enter: "animated fadeInDown",
		exit: "animated fadeOutUp"
	}
});

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
