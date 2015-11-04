var tempFakeNotificationData = [
{head:"Notification1",body:"Tom's going to your christmas party!",boxId:"1"},
{head:"Notification2",body:"Dick invited you to trivia night at the cambie!",boxId:"2"},
{head:"Notification3",body:"Harry's Birthday Party is today!",boxId:"3"},
{head:"Notification4",body:"Sally commented on your christmas party",boxId:"4"}];


$(document).ready(function() {
	//Get the script to get events
	// $.getScript("js/serverInteractions/eventServerInteraction.js");

	console.log("Loading home page script");
	createContentBoxes(tempFakeNotificationData,$("#mainContent"));
	loadFriends();

	$("#notificationsButton").click(function(){
		createContentBoxes(tempFakeNotificationData,$("#mainContent"));
	});

	$("#eventsButton").click(function(){
		getEvents(function(resp){
			var formattedEvents = formatEvents(resp);
			createContentBoxes(formattedEvents,$("#mainContent"));
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
});

function handleContentBoxLinks() {
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
	$("#friends").html();
	$.each( tempFakeFriends, function( index, value ){
		$("#friendList").append(
			'<li><a href="">'
			+ value
			+'</a></li>'
			);
	});
}

function formatEvents(eventArray){
	//This function is responsible for putting the events returned from the server into a form createContentBoxes understands
	var arrayLen = eventArray.length;
	var notificationArray = []; //The running array of formatted events from the server
	if(arrayLen == 0){
		//No events, nothing to do
		console.log("No events to form");
		return;
	}
	for(i=0; i<arrayLen; i++){
		var name = eventArray[i].display_name;
		var id = eventArray[i].id;
		var message;
		if (eventArray[i].end_date == null) {
			message = "at " + eventArray[i].start_date;
		} else {
			message = eventArray[i].start_date + " to " + eventArray[i].end_date; //We can make this meaningful later
		}
		var object = {
			'head' : name,
			'body' : message,
			'boxId' : id,
		};

		notificationArray.push(object);
	}

	return notificationArray;// Do this
}
