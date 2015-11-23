$.getScript("js/global.js", function() {
	$(document).ready(function() {
		var eventData = JSON.parse( localStorage.getItem("eventObj") );
		console.log(eventData);

		loadEventData(eventData);

		GuestListModule.init(eventData);
		$("#inviteButton").click(function(){
			GuestListModule.handleInviteButton();
		});
		$("#rsvpButton").click(function(){
			GuestListModule.handleRsvpButton();
		});

		CommentModule.init(eventData);
		$("#commentForm").submit(function(event) {
			event.preventDefault(); // do not redirect
			CommentModule.postComment();
		});

		ShoppingListModule.init(eventData);
		$("#newClaimedItemButton").click(function() {
			ShoppingListModule.newItem(true);
		});
		$("#newUnclaimedItemButton").click(function() {
			ShoppingListModule.newItem(false);
		});
		$(document).on("click",'#shoppingList button',function(e) {
			var itemId = $(this).attr("id");
			ShoppingListModule.claimItem(itemId);
		});

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

var CommentModule = {
	// comment = { id:Int, author:String, post_date: YYYY-MM-DDTHH:MM:SS.446000Z, content:String, event:Int }
	comments: [],
	eventId: -1,

	init: function(e) {
		this.eventId = e.id;
		this.comments = e.comments;

		this.updateUI();
	},

	postComment: function() {
		var newComment = {
			author: LetsDoThis.Session.getInstance().getUserInfo(),
			post_date: currentDate(),
			content: $('textarea#commentTextArea').val()
		};
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
		// post new comment to server
		addComment(this.eventId, LetsDoThis.Session.getInstance().getUserId(), comment.post_date, comment.content);
	}
};

var GuestListModule = {
	// guest = {id:Int, username:String, status:Int}
	// status 0 == attending
	// status 1 == invited
	// status 2 == uninvited
	// status 3 == declined
	// gustList is a dict, not an array, guests are indexed by id
	guestList: {},
	userId: -1,
	eventId: -1,

	init: function(e) {
		this.userId = LetsDoThis.Session.getInstance().getUserId();
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

	handleRsvpButton: function() {
		var yourself = this.guestList[this.userId];
		yourself.status = 0;
		this.updateServer(yourself);
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
			rsvpToEvent(this.eventId, "accepts", function(){});
		} else if (guest.status == 1) { // invited
			inviteToEvent(this.eventId, [guest.id], function() {});
		} else if (guest.status == 2) { // uninvited
			alert("TODO implement uninviting");
		}
	}
};

var ShoppingListModule = {
	// shoppingItem = {id:Int, display_name:String, cost:Float, supplier:User, ready:Bool}
	// choppinglist is a dict, not an array
	shoppingList: {},
	eventId: -1,

	init: function(e) {
		this.eventId = e.id;

		var esli = e.shopping_list.items;
		for (i = 0; i < esli.length; i++) {
			var item = esli[i];
			this.shoppingList[item.id] = {id:item.id,display_name:item.display_name,cost:item.cost,supplier:item.supplier,ready:item.ready};
		}

		this.updateUI();
	},

	updateUI: function() {
		var str = '<h2>Shopping List</h2>';

		$.each(this.shoppingList,function(i,v){
			str += '<div data-role="collapsible"';
			if (!v.ready) {
				str += ' data-collapsed-icon="delete"'
					+ ' data-expanded-icon="delete"';
			}
			str += '>';
			str += '<h3>' + v.display_name + '</h3>';
			if (v.ready) {
				str += '<p>Cost: $' + v.cost + '</p>'
					+ '<p>' + v.supplier.username + ' got this</p>';
			} else {
				str += '<div data-role="fieldcontain">'
					+ '<label for="name">Cost:</label>'
					+ '<input type="number" '
					+ 'name="' + v.id + '" '
					+ 'id="' + v.id + '" '
					+ 'value="' + v.cost + '" />'
					+ '</div>'
					+ '<button type="submit" '
					+ 'id="' + v.id + '" '
					+ 'data-theme="a">'
					+ 'I got this'
					+ '</button>';
			}
			str += '</div>';
		});

		$("#shoppingList").html(str);
		$("#shoppingList").trigger('create');
	},

	newItem: function(isClaimed) {
		var name = $('#newItemName').val();
		var cost = $('#newItemCost').val();
		var yourself = LetsDoThis.Session.getInstance().getUserInfo();

		//temp
		this.shoppingList[99] = {id:99,display_name:name, cost:cost, supplier:yourself, ready:isClaimed};
		$('#newItemName').val("");
		$('#newItemCost').val("");

		var uiCallback = this.updateUI();
		// we live in a dystopian nightmare world where javascript has such dumb rules about scope that a method of this very object can't be accessed from within a callback function unless we make a reference to it within this method. This is the same javascript which makes everything global by default, in which you have to actively try to not make everything accessible from everywhere.
		// Sometimes when I'm writing Javascript I want to throw up my hands and say "this is bullshit!" but I can never remember what "this" refers to.
		addShoppingListItem(this.eventId, name, 1, cost, yourself.id, isClaimed, function(resp){
			this.shoppingList[resp[0].id] = {id:resp[0].id,display_name:name, cost:cost, supplier:yourself, ready:isClaimed};
			uiCallback();
		});
	},

	claimItem: function(itemId) {
		var cost = $('input#' + itemId).val();
		this.shoppingList[itemId].ready = true;
		this.shoppingList[itemId].cost = cost;
		this.shoppingList[itemId].supplier = LetsDoThis.Session.getInstance().getUserInfo();
		this.updateUI();
		this.updateServerClaimItem(this.shoppingList[itemId]);
	},

	updateServerNewItem: function(item) {
		addShoppingListItem(this.eventId, item.display_name, 1, item.cost, item.supplier.id, item.ready, function(resp){
			alert("if this: " + resp.id + " isnt undefined then this worked.");
		});
	},

	updateServerClaimItem: function(item) {
		editShoppingListItem(this.eventId, item.id, item.display_name, 1, item.cost, item.supplier.id, item.ready);
	}
};
