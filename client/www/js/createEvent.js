$(document).ready(function() {
	loadValuesFromStorage();

	//Get scripts for server interaction
	$.getScript("js/user/session.js", function(){
		console.log(LetsDoThis.Session.getInstance().getAuthToken());
	});
	$.getScript("js/serverInteractions/eventServerInteraction.js"); //Event-Server
	$("#homeButton").click(function(){
		window.location="home.html";
	});

	$("#findLocationButton").click(function(){
		//redirecting to venueSearch, will cause us to lose all our values
		//Save already filled fields into storage
		saveValuesToStorage();
		//And redirect
		window.location ="venueSearch.html";
	});

	$("#saveButton").click(function(){
		var name = document.getElementById('nameField').value;
		var date = document.getElementById('dateField').value;
		var startTime = document.getElementById('startTimeField').value;
		var endTime = document.getElementById('endTimeField').value;
		var location = document.getElementById('locationField').value;

		// var newEvent = eventBuilder(name, date, startTime, endTime, location);

		if (name != "" &&
			date != "" &&
			startTime != "") {
			//Format the times appropriately
		var startTimeFormatted = formatTime(date, startTime);
		var endTimeFormatted = formatTime(date, endTime);

		sendToServer(name, startTimeFormatted, endTimeFormatted, null, location, function(newEvent){
			openEvent(newEvent);
		});


	}
});
});

//This function is used by the location button to call back on
function setLocation(name, address){
	if(name==null||address==null){ //Ensure neither is null
		throw "Name or address was null when setting location";
	}
	$("#locationField").val(name + ": " + address); //Set the location box
}

function formatTime(date, time){
	//This function assumes a format of:
	// Date: YYYY-MM-DD
	// Time: hh:mm
	// and outputs YYYY-MM-DDThh:mm
	return date.concat('T').concat(time);
}

//Save everything in the textboxes to storage to restore it later
function saveValuesToStorage(){
	//Get the current values
	var name = document.getElementById('nameField').value;
	var date = document.getElementById('dateField').value;
	var startTime = document.getElementById('startTimeField').value;
	var endTime = document.getElementById('endTimeField').value;
	var location = document.getElementById('locationField').value;

	//Put them in storage
	localStorage.setItem("currentEventName", name);
	localStorage.setItem("currentEventDate", date);
	localStorage.setItem("currentEventStart", startTime);
	localStorage.setItem("currentEventEnd", endTime);
	localStorage.setItem("currentEventLocation", location);
}

//Load previous values back into the textboxes
function loadValuesFromStorage(){
	document.getElementById('nameField').value = localStorage.getItem("currentEventName");
	document.getElementById('dateField').value = localStorage.getItem("currentEventDate");
	document.getElementById('startTimeField').value = localStorage.getItem("currentEventStart");
	document.getElementById('endTimeField').value = localStorage.getItem("currentEventEnd");

	//Do we have a new location due to venueSearch?
	if(localStorage.getItem("arrivingFromYelp") == 1){
		//just came from the venueSearch, there may be values we wish to reload
		document.getElementById('locationField').value =
		localStorage.getItem("yelpLocationName") + ": " +
		localStorage.getItem("yelpLocationAddress");
		localStorage.setItem("arrivingFromYelp", 0);
	} else {
		document.getElementById('locationField').value =
		localStorage.getItem("currentEventLocation");
	}
}

// function eventBuilder(name, date, start, end, location) {
// 	var userId = LetsDoThis.Session.getInstance().getUserId();
// 	var newEvent  = {
// 		display_name: name,
// 		start_date:date,
// 		end_date:"",
// 		budget:0,
// 		location:location,
// 		hosts:[userId],
// 		invites:[],
// 		accepts:[userId],
// 		declines:[],
// 		comments:[]};

// 		return newEvent;
// 	}
