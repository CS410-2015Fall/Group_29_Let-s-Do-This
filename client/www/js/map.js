$(document).ready(function() {
	$.getScript("js/serverInteractions/gmapsInteraction.js", function(){
			console.log("gmaps plugin loaded, waiting for deviceready");
			//At this point the script is there, but the plugin may not be ready yet
			//As a result, we can request and prep things, but they won't be completed until the plugin is ready
			//Jumping to early will result in an error
			prepEventMarker();
	});


	$("#backButton").click(function(){
			window.history.back();
	});
});

//Will tell the gmaps script where to drop a marker when its ready
function prepEventMarker(){
	var eventDetails = getEventData();
	var location = eventDetails[0];
	var title = eventDetails[1];

	console.log('Initing with: Tit: ' + title + " Loc: " + location);
	initEventData(title, location);
}

//Gets the name and lat long of the event
//Loads the current event from localStorage
//Returns an array where the first element is the latLong and the second is the ane,
function getEventData(){
	var eventData = JSON.parse( localStorage.getItem("eventObj") );
	// console.log("Maps eventData:");
	// console.log(eventData);
	var location = eventData.location;
	var eventName = eventData.display_name;

	return [location, eventName];
}
