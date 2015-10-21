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

		sendToServer(name, date, startTime, endTime);
	});
});

function sendToServer(name, date, start, end){

	console.log('Prepping to create event on server');
	// var startUTC = start; //We likely need to format the start time
	// var endUTC = end; //We likely need to format the end time
	// var host; //Assign a host as the current user, must be a list

	var name = 'Test 1';
	var startUTC = '2015-10-05T00:01';
	var endUTC = '2015-10-05T00:01';
	 var host = ['1']; //Hosts has to be a list
	var postData = {
		"display_name": name,
		"start_date": startUTC,
		"end_date": endUTC,
		"hosts" : host,
	};

	$.ajax({
		type: 'POST',
		url: "http://159.203.12.88/api/events/",

		data: JSON.stringify(postData), //stringify makes the post data all nice and jsony
		contentType: 'application/json',
		dataType: 'json',
		success: function (resp) {
			console.log("Created event");
		},
		error: function(e) {
			console.log(e.message);
		}
	});
}
