var invitedGuests = [];
var attendingGuests = [];
var LetsDoThis = LetsDoThis || {};

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
		
		// event name is a mandatory field
		if (name == 0) {
			$("#ctn-err").html("<p>Please give your event a name!</p>");
			return;
		}
		
		$.ajax({
			type: 'POST',
			// sending to a test server for now
			url: "http://httpbin.org/post",
			data: JSON.stringify( { "display_name": name }),
			// we are using json when sending requests
			contentType: 'application/json',
			// we expect json data back from the server
			dataType: 'json',
			success: function (resp) {
				// TODO: verify that event was successfully created
				var serverData = jQuery.parseJSON(resp.data);
				LetsDoThis.Session.getInstance().setEvent({
					name: serverData.display_name
				});
				$.mobile.changePage("home.html");
			},
			error: function(e) {
				console.log(e.message);
				$("#ctnErr").html("<p>Oops! Let's Do This had a problem, and was unable to log you on.");
			}
		});
		
	});

});