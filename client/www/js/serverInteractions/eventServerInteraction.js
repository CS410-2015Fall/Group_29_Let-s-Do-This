// These functions require the following formats
// start: YYYY-MM-DDThh:mm
// end: YYYY-MM-DDThh:mm
$(document).ready(function() {
	// console.log('eventServerInt loaded');
});
// TODO: add list of invited users to create event request (sendToServer)
//       (or create separate function?)
function sendToServer(name, start, end, budget, location, callback){
	console.log('Prepping to create event on server.');

	var userId = LetsDoThis.Session.getInstance().getUserId();

	var host = [userId.toString()]; //Hosts has to be a list
	var postData = {
		"display_name": name,
		"start_date": start,
		"end_date": end,
		"hosts" : host,
		"budget" : budget,
		"location" : location,
	};

	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
	// console.log('Auth tok' + authToken);
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
			callback(resp);
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
	$.ajax({
		type: 'GET',
		url: "http://159.203.12.88/api/events/",
		dataType: 'json',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		success: function (resp) {
			console.log("Received events");
			var relevantEvents = sortEvents(resp)
			addEventsToCalendar(relevantEvents);
			callback(relevantEvents);
		},
		error: function(e) {
			console.log(e);
		}
	});
}

//Sort through all the events and return only the ones of interest to the user
function sortEvents(events){
	var userID = LetsDoThis.Session.getInstance().getUserId();
	// console.log(userID);
	var relevantEvents = []; //The running array events

	for(i=0; i<events.length; i++){
		if($.inArray(userID, events[i].hosts) > -1){
			//User is a host of event
			relevantEvents.push(events[i]);
		} else if($.inArray(userID, events[i].accepts) > -1){
			//User is going to event
			relevantEvents.push(events[i]);
		} else if($.inArray(userID, events[i].declines) > -1){
			//User declined event
			relevantEvents.push(events[i]);
		} else if($.inArray(userID, events[i].invites) > -1){
			//User is invited to event
			relevantEvents.push(events[i]);
		}
	}

	//Send back to the callback function
	return relevantEvents;
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

function inviteToEvent(eventId, userList, callback) {

	var authToken = LetsDoThis.Session.getInstance().getAuthToken();

	var putData = {
		"invites": userList
	}

	var rsvpUrl = "http://159.203.12.88/api/events/"+eventId+"/";

		$.ajax({
		type: 'PUT',
		url: rsvpUrl,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		data: JSON.stringify(putData),
		contentType: 'application/json',
		dataType: 'json',
		success: function (resp) {
			console.log("Invited user to event");
			callback();
		},
		error: function(e) {
			console.log("Failed to invite user: ");
			console.log(e);
		}
	});
}

function rsvpToEvent(eventId, rsvpStatus, callback){
	// rsvpStatus is one of:
	// - "accepts"
	// - "declines"

	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
	var userId = LetsDoThis.Session.getInstance().getUserId();

	var userList = [userId.toString()]; // has to be a list
	var putData = {
		rsvpStatus: userList
	};

	var rsvpUrl = "http://159.203.12.88/api/events/"+eventId+"/";

	$.ajax({
		type: 'PUT',
		url: rsvpUrl,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		data: JSON.stringify(putData),
		contentType: 'application/json',
		dataType: 'json',
		success: function (resp) {
			console.log("RSVP'd to event");
			callback();
		},
		error: function(e) {
			console.log("Failed to RSVP: ");
			console.log(e);
		}
	});
}

function removeHost(eventId, hostId) {
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
	// console.log('Auth tok' + authToken);
	var postData = {
		"hosts" : hostId,
	};
	
	var eventUrl = "http://159.203.12.88/api/events/"+eventId+"/hosts/remove/";

	$.ajax({
		type: 'POST',
		url: eventUrl,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		data: JSON.stringify(postData), 
		contentType: 'application/json',
		dataType: 'json',
		success: function (resp) {
			console.log("removed host of event");
			callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});
}

function editEvent(eventId, display_name, start_date, end_date, budget, location, callback){
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();

	var putData = {
		"display_name": display_name,
		"start_date": start_date,
		"end_date": end_date,
		"budget": budget,
		"location": location
	};

	var eventUrl = "http://159.203.12.88/api/events/"+eventId+"/";

	$.ajax({
		type: 'PUT',
		url: eventUrl,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		data: JSON.stringify(putData),
		contentType: 'application/json',
		dataType: 'json',
		success: function (resp) {
			console.log("Edited event");
			callback();
		},
		error: function(e) {
			console.log(e);
		}
	});
}

function deleteEvent(eventId,callback) {
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
    var eventUrl = "http://159.203.12.88/api/events/"+eventId+"/";
    
	$.ajax({
		type: 'DELETE',
		url: eventUrl,
		dataType: 'json',
		beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		success: function (resp) {
			console.log("Deleted event");
			callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});
}