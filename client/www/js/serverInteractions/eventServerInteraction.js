// These functions require the following formats
// start: YYYY-MM-DDThh:mm
// end: YYYY-MM-DDThh:mm

// TODO: add list of invited users to create event request (sendToServer)
//       (or create separate function?)
function sendToServer(name, start, end, budget, location){
	console.log('Prepping to create event on server.');

	var host = ['1']; //Hosts has to be a list
	var postData = {
		"display_name": name,
		"start_date": start,
		"end_date": end,
		"hosts" : host,
		"budget" : budget,
		"location" : location,
	};

	var authToken = LetsDoThis.Session.getInstance().getAuthToken().authToken;
	console.log(authToken);
	$.ajax({
		type: 'POST',
		url: "http://159.203.12.88/api/events/",
		beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		data: JSON.stringify(postData), //stringify makes the post data all nice and jsony
		contentType: 'application/json',
		dataType: 'json',
		success: function (resp) {
			console.log("Created event");
		},
		error: function(e) {
			console.log("Failed to create event: ");
			console.log(e);
		}
	});
}

function getEvents(callback){
	var authToken = LetsDoThis.Session.getInstance().getAuthToken().authToken;
	// This will get events from the server AND call createContentBoxes. This is because the ajax call runs async, so we need
	// to create the content boxes after a success
	$.ajax({
		type: 'GET',
		url: "http://159.203.12.88/api/events/",
		dataType: 'json',
		beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		success: function (resp) {
			console.log("Received events");
			callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});
}

function getEvent(eventId, callback){
	var authToken = LetsDoThis.Session.getInstance().getAuthToken().authToken;
	var eventUrl = "http://159.203.12.88/api/events/"+eventId+"/";
	
	$.ajax({
		type: 'GET',
		url: eventUrl,
		dataType: 'json',
		beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		success: function (resp) {
			console.log("Received event");
			callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});
}


function rsvpToEvent(eventId, rsvpStatus){
	// rsvpStatus is one of:
	// - "invites"
	// - "accepts"
	// - "declines"
	
	console.log('Prepping to RSVP to event.');

	var authToken = LetsDoThis.Session.getInstance().getAuthToken().authToken;
	var userId = LetsDoThis.Session.getInstance().getUserId().userId;
	
	var userList = [userId.toString()]; // has to be a list
	var postData = {
		rsvpStatus: userList
	};
	
	var rsvpUrl = "http://159.203.12.88/api/events/"+eventId+"/";

	$.ajax({
		type: 'PUT',
		url: rsvpUrl,
		beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		data: JSON.stringify(postData), //stringify makes the post data all nice and jsony
		contentType: 'application/json',
		dataType: 'json',
		success: function (resp) {
			console.log("RSVP'd to event");
		},
		error: function(e) {
			console.log("Failed to create event: ");
			console.log(e);
		}
	});
}