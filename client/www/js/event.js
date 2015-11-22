$.getScript("js/global.js", function() {
	$(document).ready(function() {
		var eventData = JSON.parse( localStorage.getItem("eventObj") );
		console.log(eventData);

		loadEventData(eventData);
		var userId = LetsDoThis.Session.getInstance().getUserId();

		GuestListWidget.init(userId,eventData);
		$("#inviteButton").click(function(){
			GuestListWidget.handleInviteButton();
		});
		$("#rsvpButton").click(function(){
			GuestListWidget.handleRsvpButton();
		});

		CommentWidget.init(userId,eventData);
		$("#commentForm").submit(function(event) {
			event.preventDefault(); // do not redirect
			CommentWidget.postComment();
		});
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

		this.updateUI();
	},

	postComment: function() {
		var author = LetsDoThis.Session.getInstance().getUserInfo();
		var newComment = {
			author: author,
			post_date: currentDate(),
			content: $('textarea#commentTextArea').val()
		};
		// new comments, unlike comments from the server, don't have ids or eventIds, but we don't really care because we don't actually use those.
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
		addComment(this.eventId, this.userId, comment.post_date, comment.content);
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
					return value.id != val.id;
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

		this.updateUI();
	},

	updateUI: function() {
		var str = "";
		function write(guest) {
			var statusHtml = "";
			var status = "";
			if (guest.status == 0) {
				statusHtml = ' checked="true" disabled="true"';
				status = ' (attending)';
			} else if (guest.status == 1) {
				statusHtml = ' checked="true"';
				status = " (invited)";
			} else if (guest.status == 3) {
				status = " (not attending)";
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

	handleRsvpButon: function() {
		var yourself = this.guestList[this.userId];
		yourself.status = 0;
		updateServer(yourself);
		$("#rsvpButton").attr('disabled', 'true');
		$("#rsvpPopup").popup( "open" )
		this.updateUI();
	},

	handleInviteButton: function() {
		// get checkbox data and compare it to guestList
		var ancestor = document.getElementById('friendsPopup'),
		descendents = ancestor.getElementsByTagName('input');
		var i, e;
		for (i = 0; i < descendents.length; ++i) {
			var guest = this.guestList[descendents[i].id];
			if (descendents[i].checked) {
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
		this.updateUI();
	},

	updateServer: function(guest) {
		//TODO figure out how the server calls are supposed to work, and why this isn't working
		if (guest.status == 0) { // accepted
			// can only RSVP yourself
			rsvpToEvent(this.eventId, "accepts", function(){});
		} else if (guest.status == 1) { // invited
			inviteToEvent(this.eventId, [guest.id], function() {});
		} else if (guest.status == 2) { // uninvited
			alert("TODO implemented uninviting");
		}
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
