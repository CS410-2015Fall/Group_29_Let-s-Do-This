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


// server interface
function newEvent(event) {
	// push new event to server
}

function addUserToEvent(user,event) {
	addUserToEvent(user,event,0);
}
function addUserToEvent(user,event,x) {
	// push user to event.invited on server
}
function removeUserFromEvent(user,event) {
	// whether user is invited, attending, declining, or host
}

function userToInvited(user, event) {

}
function userToAttending(user, event) {

}
function userToDeclining(user, event) {

}
function userToHost(user, event) {

}

// commentAddToEvent(comment,event)

// pull values from server using object IDs
function getUser(userId) {
	// get data from server
		var u = {user:"",
			friends:[],
			email:"",
			phone:0,
			user_id: userId};
	return u;
}

function getEvent(eventId) {
	// get data from server
		var e = {display_name:"",
			start_date:{date:"",time:""},
			end_date:{date:"",time:""},
			budget:0,
			location:"",
			hosts:[],
			invites:[],
			accepts:[],
			declines:[],
			comments:[],
			shopping_list:"",
			event_id:event_id};
	return e;
}

function getComment(commentId) {
	// get data from server
	var c = {post_date:{date:"", time:""},
			content:"",
			author:"",
			comment_id:comment_id};
	return c;
}

// conversion
function convertDate(dateObject) {
	return "monday";
}

function convertTime(dateObject) {
	return "noon";
}
