$.getScript("js/global.js", function() {
	$(document).ready(function() {
		var eventData = JSON.parse( localStorage.getItem("eventObj") );
		console.log(eventData);

		loadEventData(eventData);
		var userId = LetsDoThis.Session.getInstance().getUserId();

		GuestListModule.init(userId,eventData);
		$("#inviteButton").click(function(){
			GuestListModule.handleInviteButton();
		});
		$("#rsvpButton").click(function(){
			GuestListModule.handleRsvpButton();
		});

		CommentModule.init(userId,eventData);
		$("#commentForm").submit(function(event) {
			event.preventDefault(); // do not redirect
			CommentModule.postComment();
		});

		ShoppingListModule.init(userId,eventData);
		$("#newClaimedItemButton").click(function() {
			ShoppingListModule.newItem(true);
		});
		$("#newUnclaimedItemButton").click(function() {
			ShoppingListModule.newItem(false);
		});
		$(document).on("click",'#shoppingList button',function(e) {
			var itemId = $(this).attr("id");
			var cost = $('input#' + itemId).val();
			ShoppingListModule.claimItem(itemId,cost);
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

var GuestListModule = {
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
			// can only RSVP yourself
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
	// as guestList, choppinglist is kind of a hashmap
	shoppingList: {},
	userId: -1,
	eventId: -1,

	init: function(userId,e) {
		this.userId = userId;
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
		alert(name + ": " + cost);
		this.updateUI();

	},

	claimItem: function(itemId,cost) {
		this.shoppingList[itemId].ready = true;
		this.shoppingList[itemId].cost = cost;
		this.shoppingList[itemId].supplier = LetsDoThis.Session.getInstance().getUserInfo();
		this.updateUI();
	},

	// bindUIActions: function(shoppingList, updateUI) {
	// 	// javascript's scope is so dumb! I have to pass the shoppingList and updateUI method to this method as args because it can't see them from within the click handlers? what's the point of even putting things into an object together if they can't access their data anyway
	// 	// 'Sometimes when I'm writing Javascript I want to throw up my hands and say "this is bullshit!" but I can never remember what "this" refers to.'
	// 	$("#newClaimedItemButton").click(function() {
	// 		var name = $('#newItemName').val();
	// 		var cost = $('#newItemCost').val();
	// 		alert(name + ": " + cost);
	// 		updateUI();
	// 	});

	// 	$("#newUnclaimedItemButton").click(function() {
	// 		var name = $('#newItemName').val();
	// 		var cost = $('#newItemCost').val();
	// 		alert(name + ": " + cost);
	// 		updateUI();
	// 	});
	// 	// create new item
	// 	$(document).on("click",'#shoppingList button',function(e) {
	// 		var itemId = $(this).attr("id");
	// 		alert(itemId);
	// 		shoppingList[itemId].ready = true;
	// 		alert(shoppingList[itemId].display_name);
	// 		// updateUI();
	// 	});

	// 	//case1: click on an unclaimed item
	// 		// drops open, lets you edit price IF you click "I got this" button to claim
	// 	//case2: click on claimed item
	// 		// drops open, doesn't let you edit, shows price and claimant
	// 		// "user got this"
	// 	//case3: click new item
	// 		// drops open, lets you fill in name, price
	// 			// 3.1: create claimed item (must fill in name, cost)
	// 			// 3.2: create unclaimed item (must fill in name)
	// },

	updateServer: function() {
		// TODO
		// addShoppingListItem(eventId, display_name, quantity, cost, supplier, ready);
		// editShoppingList(eventId, display_name, quantity, cost, supplier, ready);
		// editShoppingListItem(eventId, itemId, display_name, quantity, cost, supplier, ready);
		// removeShoppingList(eventId, itemId);
	}
};
