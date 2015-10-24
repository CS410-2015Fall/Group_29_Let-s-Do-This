var invitedGuests = [];
var attendingGuests = [];

$(document).ready(function() {
	//Get scripts for server interaction
	$.getScript("js/serverInteractions/eventServerInteraction.js"); //Event-Server

	$("#backButton").click(function(){
		window.location="home.html";
	});

	$("#findLocationButton").click(function(){
		document.getElementById('locationField').value='location found !';
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

//This function assumes a format of:
// Date: YYYY-MM-DD
// Time: hh:mm
// and outputs YYYY-MM-DDThh:mm
function formatTime(date, time){
	return date.concat('T').concat(time);
}

