var invitedGuests = [];
var attendingGuests = [];

$(document).ready(function() {
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
	});

});
