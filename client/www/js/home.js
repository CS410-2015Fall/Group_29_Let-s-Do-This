$.getScript("js/global.js", function() {
	$(document).ready(function() {
		//These scripts all need to be loaded here because they are reliant on the deviceready event, which is fired in the cordova script
		//Get the script to handle the native calendar
		$.getScript("js/osInteractions/calendarInteractions.js");
		//Get the script to handle notifications
		$.getScript("js/osInteractions/notificationInteractions.js");

		console.log("Loading home page script");

		loadFriends();

		var notificationBoxes = [];
		var eventBoxes = [];
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
			window.location="profile.html";
		});

		// makes notification and event boxes act as links to their event page
		$(document).on("click", '#mainContent div', function(e) {
			if ($(this).attr("id") == "box") {
				var eventId = $(this).attr("boxId");
				openEvent(eventId);
			}
		});
	});
});

function formatEventBoxes(events) {
	var formattedEvents = [];
	$.each( events, function(i, val) {
		var boxObject = new Box(val.display_name, convertDate(val.start_date,val.end_date), val.id);
		formattedEvents.push(boxObject);
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
	$("#friends").html();
	$.each( friends, function( index, value ){
		var friend = $('<li><a href="#">'
			+ value.username
			+'</a></li>');
		friend.click(function(){
			localStorage.setItem("profileId", JSON.stringify({"id":value.id}));
			window.location="profile.html";
		});
		$("#friendList").append(friend);
	});
	$("#friendList").listview("refresh");
}
