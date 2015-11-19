$(document).ready(function() {
	$.getScript("js/serverInteractions/gmapsInteraction.js", function(){
			console.log("gmaps loaded, waiting for deviceready");
	});


	$("#backButton").click(function(){
			window.history.back();
	});
});

function loadEventMap(location){

}
