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

	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
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

// This will get events (for the current user) from the server AND call some callback function. This is because the ajax call runs async, so we need
// to create the content boxes after a success
function getEvents(callback){
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
	var userID = LetsDoThis.Session.getInstance().getUserId();
	$.ajax({
		type: 'GET',
		url: "http://159.203.12.88/api/events/",
		dataType: 'json',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		success: function (resp) {
			console.log("Received events");
			sortEvents(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});

	//Sort through all the events and return only the ones of interest to the user
	function sortEvents(events){
		// console.log(events);
		// console.log(userID);
		var releventEvents = []; //The running array events

		for(i=0; i<events.length; i++){
			if($.inArray(userID, events[i].hosts) > -1){
				//User is a host of event
				releventEvents.push(events[i]);
			} else if($.inArray(userID, events[i].accepts) > -1){
				//User is going to event
				releventEvents.push(events[i]);
			} else if($.inArray(userID, events[i].declines) > -1){
				//User declined event
				releventEvents.push(events[i]);
			} else if($.inArray(userID, events[i].invites) > -1){
				//User is invited to event
				releventEvents.push(events[i]);
			}
		}

		//Send back to the callback function
		callback(releventEvents);
	}
}

function getEvent(eventId, callback){
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
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

	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
	var userId = LetsDoThis.Session.getInstance().getUserId();

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
		data: JSON.stringify(postData),
		contentType: 'application/json',
		dataType: 'json',
		success: function (resp) {
			console.log("RSVP'd to event");
		},
		error: function(e) {
			console.log("Failed to RSVP: ");
			console.log(e);
		}
	})
}
