$(document).ready(function() {
	//These scripts all need to be loaded here because they are reliant on the deviceready event, which is fired in the cordova script
	//Get the script to handle the native calendar
	$.getScript("js/osInteractions/calendarInteractions.js");
	//Get the script to handle notifications
	$.getScript("js/osInteractions/notificationInteractions.js");

	console.log("Loading home page script");

	// TODO load some initial content
	// createContentBoxes(tempFakeNotificationData,$("#mainContent"));
	loadFriends();

	bindHomeUIActions();
});

function bindHomeUIActions() {
	$("#notificationsButton").click(function(){
		// TODO
		// getNotifications(function(resp) {
		// 	var boxes = formatNotificationBoxes(resp);
		// 	displayBoxes(boxes, $("#mainContent"));
		// });
		var tempFakeNotificationData = [
		new Box("Christmas Party","Tom is attending","1"),
		new Box("Trivia Night at The Biltmore","Dick invited you","2"),
		new Box("Harry's Birthday Party","Is today at 19:30","3"),
		new Box("Christmas Party","Sally commented","4")
		];
		displayBoxes(tempFakeNotificationData, $("#mainContent"));
	});

	$("#eventsButton").click(function(){
		getEvents(function(resp) {
			var boxes = formatEventBoxes(resp);
			displayBoxes(boxes, $("#mainContent"));
		});
	});

	$("#calendarButton").click(function(){
		$("#mainContent").html("<strong>TODO</strong>");
	});

	$("#createEventButton").click(function(){
		window.location="createEvent.html";
	});

	$("#profileButton").click(function(){
	});
	$("#friendsButton").click(function(){
	});

	handleContentBoxLinks();
}

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
		var boxObject = new Box("event name","content of notification","0"); // TODO
		formattedNotificationsspush(boxObject);
	});
	return formattedNotifications;
}

function handleContentBoxLinks() {
	// makes notification and event boxes act as links to their event page
	$(document).on("click", '#mainContent div', function(e) {
		if ($(this).attr("id") == "box") {
			var eventId = $(this).attr("boxId");
			getEvent(eventId, function(resp) {
				openEvent(resp);
			});
		}
	});
}

function loadFriends() {
	// var friendIds = LetsDoThis.Session.getInstance().getUserFriends();

	$("#friends").html();
	$.each( tempFakeFriends, function( index, value ){
		$("#friendList").append(
			'<li><a href="">'
			+ value
			+'</a></li>'
			);
	});
	$("#friendList").listview("refresh");
}
