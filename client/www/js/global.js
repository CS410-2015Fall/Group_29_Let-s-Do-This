$.getScript("js/user/login-controller.js");
$.getScript("js/user/session.js");
$.getScript("js/serverInteractions/eventServerInteraction.js");

//temp fake data
var tempFakeFriends = ["Tom","Dick","Harry","Sally","Wolfgang","Emil","Mathias","Magnus","Jonas","William","Oliver","Noah","Adrian","Tobias","Elias","Daniel","Henrik","Sebastian","Lucas","Martin","Andreas","Benjamin","Leon","Sander","Alexander","Liam","Isak","Jakob","Kristian","Aksel","Julian","Fredrik","Sondre","Johannes","Erik","Marius","Jonathan","Filip"];


//UI
function createContentBoxes(boxes,divLocation) {
	divLocation.html("");
	$.each( boxes, function( index, value ){
		divLocation.append(
			'<div id="box" eventId="'
			+ value.eventId
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
function newEvent(event) {
	// push new event to server
}

function addUserToEvent(user,event) {
	addUserToEvent(user,event,0);
}

function addUserToEvent(user,event,x) {
	// user is invited
}

function removeUserFromEvent(user,event) {
	// can only remove invited user (not accepted, declined)
}

// pull values from server using object IDs
function getUser(userId) {
	// get data from server
	var u = {
		user:"",
		friends:[],
		email:"",
		phone:0,
		user_id: userId
	};
	return u;
}

function getEvent(eventId) {
	// get data from server
	var e = {
		display_name:"",
		start_date:"",
		end_date:"",
		budget:0,
		location:"",
		hosts:[],
		invites:[],
		accepts:[],
		declines:[],
		comments:[],
		shopping_list:"",
		event_id:event_id
	};
	return e;
}

function getComment(commentId) {
	// get data from server
	var c = {
		post_date:"",
		content:"",
		author:"",
		comment_id:comment_id
	};
	return c;
}

// conversion
function convertDateRange(date1,date2) {
	//takes two DateTime strings, "YYYY-MM-DDTHH:MM:SSZ"
}

function convertDate(dateObject) {
	// var now = currentDate();
	// if (now.getFullYear() != dateObject.getFullYear()) {

	// } else {

	// }
	return dateObject.toDateString();
}

function convertTime(dateObject) {
	// TODO watch out for the dumb time zone conversions that seem to happen sometimes. might have to deal with those.
	var hour = dateObject.getHours();
	var minute = dateObject.getMinutes();
	if (minute == 0) {
		minute = "o'clock";
	} else {
		minute = ":" + minute;
	}
	return "" + hour + minute;
}

function currentDate() {
	return new Date($.now());
}
