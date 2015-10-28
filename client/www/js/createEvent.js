var invitedGuests = [];
var attendingGuests = [];

$(document).ready(function() {
	//Get scripts for server interaction
	$.getScript("js/user/session.js", function(){
		console.log(LetsDoThis.Session.getInstance().getAuthToken());
	});
	$.getScript("js/serverInteractions/eventServerInteraction.js"); //Event-Server

	$("#backButton").click(function(){
		window.location="home.html";
	});

	$("#findLocationButton").click(function(){
		window.open("venueSearch.html");
	});

	$("#saveButton").click(function(){
		var name = document.getElementById('nameField').value;
		var date = document.getElementById('dateField').value;
		var startTime = document.getElementById('startTimeField').value;
		var endTime = document.getElementById('endTimeField').value;

		//Format the times appropriately
		var startTimeFormatted = formatTime(date, startTime);
		var endTimeFormatted = formatTime(date, endTime);
		sendToServer(name, startTimeFormatted, endTimeFormatted);
	});
});

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
