$.getScript("js/global.js", function() {
	$(document).ready(function() {
		var eventData = JSON.parse( localStorage.getItem("eventObj") );
		console.log(eventData);

		loadEventData(eventData);

		GuestListWidget.init(eventData);
		CommentWidget.init(eventData);


		$("#homeButton").click(function(){
			window.location="home.html";
		});

		$("#viewMap").click(function(){
			// TODO Save the location, and name, into the session storage so the map script can pull it up

			window.location="map.html";
		});
	});
});

function loadEventData(e) {
	// console.log("loading event");
	// console.log(e);
	$("#eventName").html("<strong>" + e.display_name + "</strong>");

	var dateString = convertDate(e.start_date,e.end_date);

	$("#dateTime").html(dateString);
	$("#location").html("Location: " + e.location);

}



var CommentWidget = {
	comments: [],
	userId: -1,
	eventId: -1,

	init: function(e) {
		this.userId = LetsDoThis.Session.getInstance().getUserId();
		this.eventId = e.id;

	},

	updateUI: function() {
		var formattedComments = [];
		$.each( this.comments, function( index, comment ){
			var h = comment.author.username + " commented at " + convertDate(comment.post_date);
			var c = new Box(h,comment.content,"");
			formattedComments.push(c);
		});

		displayBoxes(formattedComments);
	},

	bindUIActions: function() {
		$("#commentForm").submit(function(event) {
			event.preventDefault(); // do not redirect
			// postComment(eventData);
			function postComment(event, comment) {
				var date = currentDate();
				var author = LetsDoThis.Session.getInstance().getUserInfo();
				var newComment = {
					author: author,
					post_date: date,
					content: $('textarea#commentTextArea').val()
				};

	// update UI
	getAllComments(event.id, function(resp) {
		resp.push(newComment);
		var uiFormattedComments = formatComments(resp);
		createContentBoxes(uiFormattedComments,$("#comments"));
		$('textarea#commentTextArea').val("");
	});
	// var comments = event.comments; // if we get comments from the server here we will update with any other comments posted since we last reloaded from it
	// comments.push(newComment);

	// send comment to server
	addComment(event.id,
		LetsDoThis.Session.getInstance().getUserId(),
		date,
		newComment.content);
}
});
	},

	updateServer: function(comment) {

	}
};

var GuestListWidget = {
	// guest = {id:Int, username:String, status:Int}
	//TODO might need to give guest a 'setStatus' method. it depends on whether var g = getUser(0); returns a reference to or copy of the guest object
	// status 0 == attending
	// status 1 == invited
	// status 2 == uninvited
	// status 3 == declined
	guestList: {},
	userId: -1,

	init: function(e) {
		this.userId = LetsDoThis.Session.getInstance().getUserId();

		var invites = e.invites;
		var accepts = e.accepts;
		var declines = e.declines;
		var friends = LetsDoThis.Session.getInstance().getUserFriends();
		// reduce friends so that it contains only uninvited friends
		function reduceList(l1,l2) {
			$.each(l2, function(index, val) {
				l1 = jQuery.grep(l1, function(value) {
					return value != val;
				});
			});
			return l1;
		}
		friends = reduceList(friends,invites);
		friends = reduceList(friends,accepts);
		friends = reduceList(friends,declines);

		// push accepted, invited, uninvited and declined guests to guestList
		function convertAndPushGuest(list,s,guests) {
			var gusets
			$.each(list, function(index, val) {
				guests[val.id] = {id:val.id, username:val.username, status:s};
			});
		}
		convertAndPushGuest(accepts,0,this.guestList);
		convertAndPushGuest(e.hosts,0,this.guestList);
		convertAndPushGuest(invites,1,this.guestList);
		convertAndPushGuest(friends,2,this.guestList);
		convertAndPushGuest(declines,3,this.guestList);

		// TODO can we setup guestList to be a hashmap keyed to user ids?

		// TODO should i move these out of init and call them by hand instead??
		this.bindUIActions();
		this.updateUI();
	},

	updateUI: function() {
		var str = "";
		function write(guest) {
			var statusHtml = "";
			var status = "";
			if (guest.status==0) {
				statusHtml = ' checked="true" disabled="true"';
				status = ' (accepted)';
			} else if (guest.status==1) {
				statusHtml = ' checked="true"';
				status = " (invited)";
			} else if (guest.status==3) {
				status = " (declined)";
			}

			str += '<input '
			+ 'type="checkbox" '
			+ 'name="accept" '
			+ 'id="' + guest.id + '" '
			+ 'value="' + guest.id + '" '
			+ statusHtml + '>'
			+ '<label '
			+ 'for="' + guest.id + '">'
			+ guest.username
			+ status
			+ '</label>';
		}
		$.each(this.guestList, function(i, guest) {
			write(guest);
		});
		$("fieldset#friendsPopup").html(str);
		$("#friendsPopup").trigger('create');

		// disable RSVP button if you're already confirmed as attending
		if (this.guestList[this.userId].status == 0) {
			$("#rsvpButton").attr('disabled','true');
		}
	},

	bindUIActions: function() {
		$("#inviteButton").click(function(){
			// get checkbox data and compare it to guestList
			var ancestor = document.getElementById('friendsPopup'),
			descendents = ancestor.getElementsByTagName('input');
			var i, e;
			for (i = 0; i < descendents.length; ++i) {
				g = descendents[i];
				if (e.checked) {
					var guest = guestList[g.id];
					if (guest.status == 2) { // uninvited -> invited
						guest.status = 1;
						this.updateServer(guest);
					}
				} else {
					if (guest.status == 1) { // invited -> uninvited
						guest.status = 2;
						this.updateServer(guest)
					}
				}
			}
			$("#friendsPopup").popup("close");
		});

		$("#rsvpButton").click(function(){
			var yourself = guestList[this.userId];
			yourself.status = 0;
			updateServer(yourself);
			$("#rsvpButton").attr('disabled', 'true');
			$("#rsvpPopup").popup( "open" )
		});
	},

	updateServer: function(guest) {
		if (guest.status == 0) { // accepted

		} else if (guest.status == 1) { // invited

		} else if (guest.status == 2) { // uninvited

		}

		// use some of this? :::::::
		// function inviteFriends(e,invitedUsers) {
		// 	inviteToEvent(e.id, invitedUsers, function(){
		// 		// on success, update event information
		// 		// there is probably a simpler way to do this
		// 		getEvent(e.id,function(updatedEvent){
		// 			localStorage.setItem("eventObj", JSON.stringify(updatedEvent));
		// 			eventData = JSON.parse( localStorage.getItem("eventObj") );
		// 			loadGuests(eventData);
		// 		});
		// 	});
		// }
	},

	getUser: function(id) {
		//TODO what if it doesn't find anything?
		$.each(this.guestList, function(i,val) {
			if (id === val.id) {
				return val;
			}
		});
	}
};

var ShoppingListWidget = {
	// shoppingItem = {name:String, cost:Int, userId:Int}
	shoppingList: [],

	init: function() {

	},

	updateUI: function() {

	},

	buildUIActions: function() {

	},

	updateServer: function() {

	}
};
