$(document).ready(function() {
	//Did we arrive here from venueSearch?
	if(localStorage.getItem("arrivingFromYelp") == 1){
		//We just came from the venueSearch, so there may be values we wish to reload
		reloadValues();
		localStorage.setItem("arrivingFromYelp", 0);
	}

	//Get scripts for server interaction
	$.getScript("js/user/session.js", function(){
		console.log(LetsDoThis.Session.getInstance().getAuthToken());
	});
	$.getScript("js/serverInteractions/eventServerInteraction.js"); //Event-Server

	$("#homeButton").click(function(){
		window.location="home.html";
	});

	$("#findLocationButton").click(function(){
		//We will have to redirect to venueSearch, causing us to lose all our values
		//Save already filled fields into storage
		saveValuesToStorage();
		//And redirect
		window.open("venueSearch.html");
	});

	$("#saveButton").click(function(){
		var name = document.getElementById('nameField').value;
		var date = document.getElementById('dateField').value;
		var startTime = document.getElementById('startTimeField').value;
		var endTime = document.getElementById('endTimeField').value;

		if (name != "" &&
			date != "" &&
			startTime != "") {
			//Format the times appropriately

			var startTimeFormatted = formatTime(date, startTime);
			var endTimeFormatted = formatTime(date, endTime);
			sendToServer(name, startTimeFormatted, endTimeFormatted);

			var newEvent = eventBuilder(name, date, startTime, endTime, document.getElementById('locationField').value);

			openEvent(newEvent);
		}
	});
});

function openEvent(destinationEvent) {
	localStorage.setItem("eventObj", JSON.stringify(destinationEvent));
	window.location="event.html";
}

//This function is used by the location button to call back on
function setLocation(name, address){
	if(name==null||address==null){ //Ensure neither is null
		throw "Name or address was null when setting location";
	}
	$("#locationField").val(name + ": " + address); //Set the location box
}
//This function assumes a format of:
// Date: YYYY-MM-DD
// Time: hh:mm
// and outputs YYYY-MM-DDThh:mm
function formatTime(date, time){
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
function reloadValues(){
	document.getElementById('nameField').value = localStorage.getItem("currentEventName");
	document.getElementById('dateField').value = localStorage.getItem("currentEventDate");
	document.getElementById('startTimeField').value = localStorage.getItem("currentEventStart");
	document.getElementById('endTimeField').value = localStorage.getItem("currentEventEnd");

	//Do we have a new location due to venueSearch?
	if(localStorage.getItem("arrivingFromYelp") == 1){
		//We just came from the venueSearch, so there may be values we wish to reload
		document.getElementById('locationField').value = localStorage.getItem("yelpLocationName") + ": " + localStorage.getItem("yelpLocationAddress");
	} else {
		document.getElementById('locationField').value = localStorage.getItem("currentEventLocation");
	}
}

function eventBuilder(name, date, start, end, location) {
	var newEvent  = {
		display_name: name,
		start_date:{date:date,time:start},
		end_date:{date:date,time:end},
		budget:0,
		location:location,
		hosts:["you"],
		invites:[],
		accepts:[],
		declines:[],
		comments:[]};

	return newEvent;
}
