$.getScript("js/user/login-controller.js");
$.getScript("js/user/session.js");
$.getScript("js/serverInteractions/eventServerInteraction.js");
$.getScript("js/serverInteractions/commentServerInteraction.js");
$.getScript("js/serverInteractions/userServerInteraction.js");

//temp fake data
var tempFakeFriends = ["Tom","Dick","Harry","Sally","Wolfgang","Emil","Mathias","Magnus","Jonas","William","Oliver","Noah","Adrian","Tobias","Elias","Daniel","Henrik","Sebastian","Lucas","Martin","Andreas","Benjamin","Leon","Sander","Alexander","Liam","Isak","Jakob","Kristian","Aksel","Julian","Fredrik","Sondre","Johannes","Erik","Marius","Jonathan","Filip"];

//UI
function createContentBoxes(boxes,divLocation) {
	divLocation.html("");
	$.each( boxes, function( index, value ){
		divLocation.append(
			'<div id="box" boxId="'
			+ value.boxId
			+'"><p><strong>'
			+ value.head
			+ '</strong><br>'
			+ value.body
			+ '</p></div>');
	});
}

//navigation
function openEvent(destinationEvent) {
	localStorage.setItem("eventObj", JSON.stringify(destinationEvent));
	window.location="event.html";
}

// server interface
// function newEvent(event) {
// 	// push new event to server
// }

// function addUserToEvent(user,event) {
// 	addUserToEvent(user,event,0);
// }

// function addUserToEvent(user,event,x) {
// 	// user is invited
// }

// function removeUserFromEvent(user,event) {
// 	// can only remove invited user (not accepted, declined)
// }

// pull values from server using object IDs
function getUserById(userId) {
	return getUser(userId, function(resp) {
		return {
			username:resp.username,
			user_id: userId
		};
	});
}

function getEventById(eventId, callback) {
	//more appropriately named getEventWithId, creates event to include event_id field
	getEvent(eventId, function(resp) {
		var e = {
			display_name:resp.display_name,
			start_date:resp.start_date,
			end_date:resp.end_date,
			budget:resp.budget,
			location:resp.location,
			hosts:resp.hosts,
			invites:resp.invites,
			accepts:resp.accepts,
			declines:resp.declines,
			comments:resp.comments,
			shopping_list:resp.shopping_list,
			event_id:eventId
		};
		callback(e);
	});
}

// function getComment(commentId) {
// 	// get data from server
// 	var c = {
// 		post_date:"",
// 		content:"",
// 		author:"",
// 		comment_id:comment_id
// 	};
// 	return c;
// }

// conversion
function convertDate(dateString1,dateString2) {
	// takes two DateTime strings, "YYYY-MM-DDTHH:MM:SSZ"
	// returns a string which reads more nicely
	var start = new Date(dateString1);
	var end = new Date(dateString2);

	if (typeof end === 'undefined') {
		return convertDate(dateString1);
	}

	if (start.getDate() == end.getDate()) {
		return "On " + start.toDateString() + " from " + convertTime(start) + " until " + convertTime(end);
	} else {
		return "From " + start.toDateString() + " at " + convertTime(start) + " until " + end.toDateString() + " at " + convertTime(end);
	}

	// var now = currentDate();
	// if (now.getFullYear() != dateObject.getFullYear()) {

	// } else {

	// }
}

function convertDate(dateString) {
	var dateObject = new Date(dateString);

	var time = convertTime(dateObject)
	var date = dateObject.toDateString();
	return date + " at " + time;
}

function convertTime(dateObject) {
	var hour = dateObject.getHours();
	var minute = dateObject.getMinutes();
	if (minute < 10) {
		minute = "0" + minute;
	}
	return "" + hour + ":" + minute;
}

function currentDate() {
	return new Date($.now());
}
