


$.get("http://ipinfo.io", function(response) {
	    console.log(response.city, response.region);
}, "jsonp");

//login modal
$("#login").click(function(){
	$("#modal").toggle();
	$("#modal").addClass("animated fadeIn");

})

$("#close-modal").click(function(){
	$("#modal").toggle();
})

