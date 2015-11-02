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
// newEvent(event)
// userAddToEvent(user,event)
// userRemoveFromEvent(user,event)

// userToAttending(user, event)
// userToDeclining(user, event)
// userToHost(user, event)
// userToInvited(user, event)

// commentAddToEvent(comment,event)

function getUser(userId) {
	// get user from server
	var u = {user:"",
			friends:[],
			email:"",
			phone:0,
			userId: user_id};
	return u;
}

function getEvent(eventId) {
	// hit server up
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
			eventId:event_id};
	return e;
}

function getComment(commentId) {
	// hit server up
	var c = {post_date:{date:"", time:""},
			content:"",
			author:"",
			commentId:comment_id};
	return c;
}
