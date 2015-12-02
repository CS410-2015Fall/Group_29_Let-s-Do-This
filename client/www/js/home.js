var notificationBoxes = [];
var eventBoxes = [];

//Once we have the global script we need to initialize all scripts in it by
//calling initializeScripts which itself has a callback when all scripts are loaded
$.getScript("js/global.js", function() {
	initializeScripts(globalCallback);
});

document.addEventListener("deviceready", function(){
	//Both notifications and the calendar are dependant on this deviceready being called


}, false);


function formatEventBoxes(events) {
	var formattedEvents = [];
	$.each( events, function(i, val) {
		if (!val.cancelled) {
			var boxObject = new Box(val.display_name, convertDate(val.start_date,val.end_date), val.id);
			formattedEvents.push(boxObject);
		}
	});
	return formattedEvents;
}

function formatNotificationBoxes(events) {
	var formattedNotifications = [];
	$.each( events, function(i, val) {
		var boxObject = new Box(val.display_name,"This event has been modified!",val.id);
		formattedNotifications.push(boxObject);
	});
	return formattedNotifications;
}

function loadFriends() {
	var friends = LetsDoThis.Session.getInstance().getUserFriends();
	console.log(friends);
	$("#friendList").empty();
	$.each( friends, function( index, value ){
		var friend = $('<li><a href="#">'
		+ value.username
		+'</a></li>');
		friend.click(function(){
			//localStorage.setItem("profileId", JSON.stringify({"id":value.id}));
			LetsDoThis.Session.getInstance().setProfileId({"id":value.id});
			window.location="profile.html";
		});
		$("#friendList").append(friend);
	});
	$("#friendList").listview("refresh");
}

function loadUsers(users) {
	$("#usersList").empty();
	$.each( users, function( index, value ){
		var user = $('<li><a href="#">'
		+ value.username
		+'</a></li>');
		user.click(function(){
			//localStorage.setItem("profileId", JSON.stringify({"id":value.id}));
			LetsDoThis.Session.getInstance().setProfileId({"id":value.id});
			window.location="profile.html";
		});
		$("#usersList").append(user);
	});
	$("#usersList").listview("refresh");
}

function checkForNewFriends(){
	console.log("Checking for new friends");
	var userID = LetsDoThis.Session.getInstance().getUserId();
	//Get our current friends
	var currentFriends = LetsDoThis.Session.getInstance().getUserFriends();

	//Load the friends we had last time we checked
	var oldFriends = JSON.parse(window.localStorage.getItem('previousFriends' + userID));

	//Check if we even had friends previously
	if(oldFriends==null){
		//Save the friends we have now so we have friends next time we look
		window.localStorage.setItem('previousFriends' + userID, JSON.stringify(currentFriends));
		return;
	}

	console.log("old:");
	console.log(oldFriends);
	console.log("new:");
	console.log(currentFriends);
	//Loop through each of our current friends to check if they existed previously
	for(var i = 0; i<currentFriends.length; i++){
		//Get the friends id
		var friendsID = currentFriends[i].id;

		//Set a flag if they existed previously;
		var existedPreviously = 0; //Typical boolean values

		//Loop through the old friends and look for this id
		for(var i = 0; i<oldFriends.length; i++){
			//Get the friends id
			var oldFriendsID = oldFriends[i].id;
			if(oldFriendsID==friendsID){
				existedPreviously = 1;
			}
		}

		//Notify if this is a new friend
		if(!existedPreviously){
			console.log(currentFriends[i].username + " is a new friend!");
			notifyOfNewFriend(currentFriends[i].username);
		}
	}

	//Now save these current friends so we can check next time
	window.localStorage.setItem('previousFriends' + userID, JSON.stringify(currentFriends));
}

function globalCallback(){
	console.log("Global scripts loaded, here is the callback");
	$(document).ready(function() {
		//These scripts all need to be loaded here because they are reliant on the deviceready event, which is fired in the cordova script
		var allUsers = [];
		getAllUsers(function(resp){
			allUsers = resp;
		});
		console.log("Loading home page script");

		$("#notificationsButton").click(function() {
			if (notificationBoxes.length == 0) {
				$("#mainContent").html("<h2>No new notifications!</h2>");
			} else {
				displayBoxes(notificationBoxes, $("#mainContent"));
			}
		});

		$("#eventsButton").click(function(){
			if (eventBoxes.length == 0) {
				getEvents(function(resp) {
					// TODO don't display cancelled events
					eventBoxes = formatEventBoxes(resp);
					displayBoxes(eventBoxes, $("#mainContent"));
				});
			} else {
				displayBoxes(eventBoxes, $("#mainContent"));
			}
		});

		$("#createEventButton").click(function(){
			localStorage.setItem("editEvent", 0);
			window.location="createEvent.html";
		});

		$("#profileButton").click(function(){
			var userId = LetsDoThis.Session.getInstance().getUserId();
			//localStorage.setItem("profileId", JSON.stringify({"id":userId}));
			LetsDoThis.Session.getInstance().setProfileId({"id":userId});
			window.location="profile.html";
		});

		$("#friendsButton").click(function(){
			loadFriends();
		});
		
		$("#usersButton").click(function(){
			loadUsers(allUsers);
		});

		// makes notification and event boxes act as links to their event page
		$(document).on("click", '#mainContent div', function(e) {
			if ($(this).attr("id") == "box") {
				var eventId = $(this).attr("boxId");
				openEvent(eventId);
			}
		});

		//Look for changed events
		getChangedEvents(function(notifs) {
			if (notifs.length > 0) {
				notificationBoxes = formatNotificationBoxes(notifs);
				displayBoxes(notificationBoxes, $("#mainContent"));
			} else {
				getEvents(function(e) {
					eventBoxes = formatEventBoxes(e);
					displayBoxes(eventBoxes, $("#mainContent"));
				});
			}
		});

		// loadFriends();
		
		// checkForNewFriends();
	});
}
