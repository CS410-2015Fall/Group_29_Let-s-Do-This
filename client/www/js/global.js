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

// function getEventById(eventId) {
// 	getEvent(eventId, function(resp) {
// 		var e = {
// 			display_name:resp.display_name,
// 			start_date:"",
// 			end_date:"",
// 			budget:0,
// 			location:"",
// 			hosts:[],
// 			invites:[],
// 			accepts:[],
// 			declines:[],
// 			comments:[],
// 			shopping_list:"",
// 			event_id:event_id
// 		};
// 		return e;
// 	});
// }

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
	//takes two DateTime strings, "YYYY-MM-DDTHH:MM:SSZ"
	var dateObject1 = new Date(dateString1);
	var dateObject2 = new Date(dateString2);

	if (typeof dateObject2 === 'undefined') {
		return convertDate(dateString1);
	}

	if (e.end_date == "") {
		$("#dateTime").html("On " + convertDate(start) + " at " + convertTime(start));
	} else if (start.getDate() == end.getDate()) {
		$("#dateTime").html("On " + convertDate(start) + " from " + convertTime(start) + " until " + convertTime(end));
	} else {
		$("#dateTime").html("From " + convertDate(start) + " at " + convertTime(start) + " until " + convertDate(end) + " at " + convertTime(end));
	}

	// var now = currentDate();
	// if (now.getFullYear() != dateObject.getFullYear()) {

	// } else {

	// }
	return dateObject.toDateString();
}

function convertDate(dateString) {
	var dateObject = new Date(dateString);

	var time = convertTime(dateObject)
	var date = dateObject.toDateString();
	return time + " on " + date;
}

function convertTime(dateObject) {
	// TODO watch out for the dumb time zone conversions that seem to happen sometimes. might have to deal with those.
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
