$.getScript("js/global.js", function() {
	initializeScripts(loadEvent);
});

function loadEvent(){
	$(document).ready(function() {
		getEvent(JSON.parse(localStorage.getItem("eventId")), function(resp) {
			var eventData = resp;
			console.log(eventData);

			$("#eventName").html("<strong>" + eventData.display_name + "</strong>");
			$("#dateTime").html(convertDate(eventData.start_date,eventData.end_date));
			$("#location").html("Location: " + eventData.location);

			// Guest list
			GuestListModule.init(eventData,$("fieldset#friendsPopup"));
			$("#inviteButton").click(function(){
				GuestListModule.handleInviteButton($("#friendsPopup"));
			});
			$("#rsvpButton").click(function(){
				GuestListModule.handleRsvpButton($("#rsvpButton"),$("#rsvpPopup"));
			});
			if (GuestListModule.guestList[GuestListModule.userId].status == 0) {
				// disable RSVP button if you're already attending
				$("#rsvpButton").attr('disabled','true');
			}

			// Comments
			CommentModule.init(eventData,$('#comments'));
			$("#commentForm").submit(function(event) {
				event.preventDefault(); // do not redirect
				CommentModule.postComment($('textarea#commentTextArea'));
			});

			// Shopping list
			ShoppingListModule.init(eventData,$("#shoppingList"));
			$("#newClaimedItemButton").click(function() {
				ShoppingListModule.newItem(true,$('#newItemName'),$('#newItemCost'));
			});
			$("#newUnclaimedItemButton").click(function() {
				ShoppingListModule.newItem(false,$('#newItemName'),$('#newItemCost'));
			});
			$(document).on("click",'#shoppingList button',function(e) {
				var itemId = $(this).attr("id");
				ShoppingListModule.claimItem(itemId,$('input#' + itemId));
			});
			$("#getBalanceButton").click(function() {
				var guestCount = eventData.accepts.length + eventData.hosts.length;
				ShoppingListModule.calculateBalance(GuestListModule.userId,guestCount,$("#balancePopup"));
			})

			//Polls
			PollModule.init(eventData,$("#polls"));
			$("#newPollButton").click(function() {
				var pollName = document.getElementById('newPollName');
				var choices = document.getElementById('newPollAnswers').getElementsByTagName('input');
				var choiceStrings = [];
				$.each(choices, function(i,v) {
					choiceStrings.push(v.value);
				});
				PollModule.createPoll(pollName.value,choiceStrings);

				pollName.value = "";
				$("#newPollAnswers").html(PollModule.newChoice(0));
				$("#newPollAnswers").append(PollModule.newChoice(1));
				$("#newPollAnswers").trigger('create');
			});
			$("#moreAnswersButton").click(function() {
				var choicesDiv = document.getElementById('newPollAnswers');
				var choices = choicesDiv.getElementsByTagName('input');

				$("#newPollAnswers").append(PollModule.newChoice(choices.length));
				$("#newPollAnswers").trigger('create');
			});

			// Other
			$("#homeButton").click(function(){
				window.location="home.html";
			});
			$("#editButton").click(function(){
				localStorage.setItem("editEvent", eventData.id);
				window.location="createEvent.html";
			});

			$("#viewMap").click(function(){
				// Save the location, and name, into the session storage so the map script can pull it up
				var mapInfo = {
					'location': eventData.location,
					'name': eventData.display_name
				}
				sessionStorage.setItem("mapInfo", JSON.stringify(mapInfo));
				window.location="map.html";
			});

			//Modules
			var detachedSLM = $("#shoppingListModule").detach();
			var detachedPM = $("#pollsModule").detach();
			var detachedCM = $("#commentsModule").detach();
			$("#modules").append(detachedCM);
			$("#commentsModuleButton").click(function(){
				$("#modules").append(detachedCM);
				$("#shoppingListModule").detach();
				$("#pollsModule").detach();
			});
			$("#pollsModuleButton").click(function(){
				$("#modules").append(detachedPM);
				$("#shoppingListModule").detach();
				$("#commentsModule").detach();
			});
			$("#shoppingListModuleButton").click(function(){
				$("#modules").append(detachedSLM);
				$("#commentsModule").detach();
				$("#pollsModule").detach();
			});
		});
	});
};

var CommentModule = {
	// comment = { id:Int, author:{User}, post_date: YYYY-MM-DDTHH:MM:SS.446000Z, content:String, event:Int }
	comments: [],
	commentDiv: {},
	eventId: -1,

	init: function(e,commentDiv) {
		this.eventId = e.id;
		this.comments = e.comments;
		this.commentDiv = commentDiv;

		this.updateUI();
	},

	postComment: function(commentField) {
		var newComment = {
			author: LetsDoThis.Session.getInstance().getUserInfo(),
			post_date: currentDate(),
			content: commentField.val()
		};
		this.comments.push(newComment);

		commentField.val("");

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
		displayBoxes(formattedComments,this.commentDiv);
	},

	updateServer: function(comment) {
		// post new comment to server
		addComment(this.eventId, LetsDoThis.Session.getInstance().getUserId(), comment.post_date, comment.content,function(resp){});
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
	guestsPopupFieldDiv: {},
	userId: -1,
	eventId: -1,

	init: function(e,guestsDiv) {
		this.userId = LetsDoThis.Session.getInstance().getUserId();
		this.eventId = e.id;
		this.guestsPopupFieldDiv = guestsDiv;

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
		this.guestsPopupFieldDiv.html(str);
		this.guestsPopupFieldDiv.trigger('create');
	},

	handleRsvpButton: function(rsvpButtonDiv,rsvpPopupDiv) {
		var yourself = this.guestList[this.userId];
		yourself.status = 0;

		rsvpToEvent(this.eventId, true, function(){}); // update server
		removeFromInvite(this.eventId,[this.userId],function(){});

		rsvpButtonDiv.attr('disabled', 'true');
		rsvpPopupDiv.popup( "open" )
		this.updateUI();
	},

	handleInviteButton: function(friendsPopupDiv) {
		// get checkbox data and compare it to guestList
		var ancestor = document.getElementById('friendsPopup'),
		descendents = ancestor.getElementsByTagName('input');
		var i, e, invites = [], removes = [];
		for (i = 0; i < descendents.length; ++i) {
			var guest = this.guestList[descendents[i].id];
			if (descendents[i].checked) {
				if (guest.status == 2) { // uninvited -> invited
					invites.push(guest.id);
					guest.status = 1
				}
			} else {
				if (guest.status == 1) { // invited -> uninvited
					guest.status = 2;
					removes.push(guest.id);
				}
			}
		}
		friendsPopupDiv.popup("close");
		this.updateUI();

		// update server
		if (removes.length > 0) {
			removeFromInvite(this.eventId,removes, function() {});
		}
		if (invites.length > 0) {
			inviteToEvent(this.eventId, invites, function() {});
		}
	}
};

var ShoppingListModule = {
	// shoppingItem = {id:Int, display_name:String, cost:Float, supplier:{User}, ready:Bool}
	// choppinglist is a dict, not an array
	shoppingList: {},
	shoppingListDiv: {},
	eventId: -1,

	init: function(e,shoppingDiv) {
		this.eventId = e.id;
		this.shoppingListDiv = shoppingDiv;

		var esli = e.shopping_list.items;
		for (i = 0; i < esli.length; i++) {
			var item = esli[i];
			this.shoppingList[item.id] = {id:item.id,display_name:item.display_name,cost:item.cost,supplier:item.supplier,ready:item.ready};
		}

		this.updateUI();
	},

	updateUI: function() {
		var str = '';

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

		this.shoppingListDiv.html(str);
		this.shoppingListDiv.trigger('create');
	},

	newItem: function(isClaimed,nameField,costField) {
		var name = nameField.val();
		var cost = costField.val();
		var yourself = LetsDoThis.Session.getInstance().getUserInfo();

		nameField.val("");
		costField.val("");
		// Sometimes when I'm writing Javascript I want to throw up my hands and say "this is bullshit!" but I can never remember what "this" refers to.
		addShoppingListItem(this.eventId, name, 1, cost, yourself.id, isClaimed, function(resp){ // update server
			ShoppingListModule.shoppingList[resp[0].id] = resp[0];
			ShoppingListModule.updateUI();
		});
	},

	claimItem: function(itemId,itemDiv) {
		var cost = itemDiv.val();
		this.shoppingList[itemId].ready = true;
		this.shoppingList[itemId].cost = cost;
		this.shoppingList[itemId].supplier = LetsDoThis.Session.getInstance().getUserInfo();
		this.updateUI();
		var item = this.shoppingList[itemId];
		editShoppingListItem(this.eventId, item.id, item.display_name, 1, item.cost, item.supplier.id, item.ready,function(resp){}); // update server
	},

	calculateBalance: function(userId,guestCount,popupDiv) {
		// balance is the sum cost of items claimed by user
		// minus the total sum cost of all claimed items
		// divided by the number of attending guests
		var userSpent = 0.0;
		var totalSpent = 0.0;
		$.each(this.shoppingList, function(i,v) {
			if (v.ready) {
				totalSpent += parseFloat(v.cost);
				if (v.supplier.id == userId) {
					userSpent += parseFloat(v.cost);
				}
			}
		});
		var balance = userSpent - (totalSpent/guestCount);
		var balance = balance.toFixed(2); // round to two decimals
		var message = "";
		if (balance == 0) {
			message = "<p>Nothing owed</p>";
		} else if (balance > 0) {
			message = "<p>You are owed $" + balance + "</p>";
		} else {
			message = "<p>You owe $" + balance + "</p>";
		}
		popupDiv.html(message);
		popupDiv.popup("open");
	}
};

var PollModule = {
	// id: 1
	// question: What is love?
	// event: 42
	// poll_choices: [{id: 3,poll: 1,choice_text: No more,votes: 1}]
	polls: [],
	pollDiv: {},
	eventId: -1,

	init: function(e, pollDiv) {
		this.polls = e.event_polls;
		this.pollDiv = pollDiv;
		this.eventId = e.id;

		this.updateUI();
	},

	updateUI: function() {
		var d = this.pollDiv;
		var vote = this.vote;

		d.html("");
		$.each(this.polls, function(i,v) {
			var totalVotes = 0;
			var inputs = [];
			$.each(v.poll_choices,function(ind,val){
				totalVotes += val.votes;
			})

			var newPoll = $("<div>", {
				class:"ui-field-contain",
				html: $("fieldset", {
					'data-role':'controlgroup'
				})
			});

			$.each(v.poll_choices,function(index, value) {
				var pollInput = $("<input>", {
					type:"radio",
					name:"poll_" + v.id,
					id:"poll_" + v.id + "_" + value.id
				});
				var pollLabel = $("<label>", {
					style:"padding:0px;",
					for:"poll_" + v.id + "_" + value.id
				});

				pollLabel.append($("<div>", {
					style:"width:" + (100 * (value.votes/totalVotes)) + "%;height:100%;position:absolute;background-color:#CCCCFF;"
				}));
				pollLabel.append($("<div>",{
					style:"margin-left:40px;position:relative;padding-top:8px;padding-bottom:8px;",
					html:value.choice_text + " (" + value.votes + " votes)"
				}));

				newPoll.prepend(pollInput);
				newPoll.prepend(pollLabel);

				inputs.push(pollInput);
			});

			newPoll.prepend($("<legend>", {
				html: "<h3>" + v.question + "</h3>"
			}));

			var voteButton = $("<button>", {
				id: "pollButton_" + v.id,
				'data-inline':"true",
				text:"Vote"
			});

			voteButton.click(function(event){
				event.preventDefault(); // do not redirect
				$.each(inputs,function(i,v){
					if (v[0].checked) {
						var pollId = v[0].id.split('_')[1];
						var choiceId = v[0].id.split('_')[2];
						vote(pollId,choiceId);
					}
				});
				$("#"+ this.id).attr("disabled",true);
			});

			newPoll.append($("<div>", {
				align:"right",
				html: voteButton
			}));

			d.prepend(newPoll);
		});

	this.pollDiv.trigger('create');
	},

	vote: function(pollId,choiceId) {
		$.each(PollModule.polls,function(i,v){
			if (v.id == pollId) {
				$.each(v.poll_choices,function(ind, val){
					if (val.id == choiceId) {
						val.votes++;
						PollModule.updateUI();
						return;
					}
				})
				return;
			}
		});
		voteEventPoll(PollModule.eventId,pollId,parseInt(choiceId),function(r){});
	},

	createPoll: function(question,choices) {
		addEventPoll(this.eventId, question, choices, function(resp) {
			PollModule.polls.push(resp);
			PollModule.updateUI();
		});
	},

	newChoice: function(i) {
		var newChoice = $("<div>",{
			'data-role':'fieldcontain'
		});
		newChoice.append($("<label>", {
			for:"name"
		}));
		newChoice.append($("<input>", {
			type:"text",
			id: "newChoice_" + i
		}));
		return newChoice;
	}
};
