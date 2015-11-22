$.getScript("js/global.js", function() {
	$(document).ready(function() {
		var eventData = JSON.parse( localStorage.getItem("eventObj") );
		console.log(eventData);

		loadEventData(eventData);

		var userId = LetsDoThis.Session.getInstance().getUserId();
		GuestListWidget.init(userId,eventData);
		CommentWidget.init(userId,eventData);
		ShoppingListWidget.init(userId,eventData);

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
	// comment = { id:Int, author:String, post_date: YYYY-MM-DDTHH:MM:SS.446000Z, content:String, event:Int }
	comments: [],
	userId: -1,
	eventId: -1,

	init: function(userId,e) {
		this.userId = userId;
		this.eventId = e.id;
		this.comments = e.comments;

		this.bindUIActions();
		this.updateUI();
	},

	bindUIActions: function() {
		//TODO make this work. CommentWidget's methods apparently aren't within scope to be called from within the submit() callback
		// can fix by changing html to use a normal button, not a button which is part of a form.
		// can also fix by redirecting the call through a truly global variable, even something as dumb as CommentWidget.postComment();
		// but that seems so stupid I can't bring myself to do it unless there really isnt a better way
		$("#commentForm").submit(function(event) {
			event.preventDefault(); // do not redirect
			// this.postComment();
		});
	},

	postComment: function() {
			var author = LetsDoThis.Session.getInstance().getUserInfo();
			var newComment = {
				author: author,
				post_date: currentDate(),
				content: $('textarea#commentTextArea').val()
			};
			// new comments, unlike comments from the server, don't have ids or eventIds, but we don't really care because we don't use those.
			this.comments.push(newComment);

			$('textarea#commentTextArea').val("");

			this.updateUI();
			this.updateServer(newComment);
	},

	updateUI: function() {
		var formattedComments = [];
		$.each( this.comments, function( index, comment ){
			var h = comment.author.username + " commented on " + convertDate(comment.post_date);
			var c = new Box(h,comment.content,"");
			formattedComments.push(c);
		});
		displayBoxes(formattedComments,$('#comments'));
	},

	updateServer: function(comment) {
		//TODO push new comment to the server
		// addComment(this.eventId, this.userId, comment.post_date, comment.content);
	}
};

var GuestListWidget = {
	// guest = {id:Int, username:String, status:Int}
	// status 0 == attending
	// status 1 == invited
	// status 2 == uninvited
	// status 3 == declined
	// guests are indexed by id, like an hashmap
	// eg this.guestList[4] == {id:4, ...}
	guestList: {},
	userId: -1,
	eventId: -1,

	init: function(userId,e) {
		this.userId = userId;
		this.eventId = e.id;

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

		// add accepted, invited, uninvited and declined guests to guestList
		function addGuests(list,s,guests) {
			$.each(list, function(index, val) {
				guests[val.id] = {id:val.id, username:val.username, status:s};
			});
		}
		addGuests(accepts,0,this.guestList);
		addGuests(e.hosts,0,this.guestList);
		addGuests(invites,1,this.guestList);
		addGuests(friends,2,this.guestList);
		addGuests(declines,3,this.guestList);

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
				if (e.checked) { // TODO this doesn't work
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
		// TODO
		// this.eventId
		// use some of this? ::::::: with
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
	}
};

var ShoppingListWidget = {
	// shoppingItem = {name:String, cost:Int, userId:Int}
	shoppingList: [],
	userId: -1,
	eventId: -1,

	init: function(userId,e) {
		this.userId = userId;
		this.eventId = e.id;


	},

	updateUI: function() {

	},

	buildUIActions: function() {

	},

	updateServer: function() {

	}
};
