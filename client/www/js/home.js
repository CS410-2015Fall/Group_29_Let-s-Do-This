var tempFakeNotificationData = [
{head:"Notification1",body:"Tom's going to your christmas party!",eventId:"1"},
{head:"Notification2",body:"Dick invited you to trivia night at the cambie!",eventId:"2"},
{head:"Notification3",body:"Harry's Birthday Party is today!",eventId:"3"},
{head:"Notification4",body:"Sally commented on your christmas party",eventId:"4"}];

var tempFakeEventData = [
{head:"Event1",body:"this is an event on a day",eventId:""},
{head:"Event2",body:"another event on another day",eventId:""},
{head:"Event3",body:"yup, you guessed it",eventId:""},
{head:"These boxes are cool",body:"because they're generated dynamically from an array of strings",eventId:""}];


$(document).ready(function() {
	//Get the script to get events
	$.getScript("js/serverInteractions/eventServerInteraction.js");

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
			var eventId = $(this).attr("eventId");
			var destinationEvent;
			// get the event data from the server using eventId
			// for now here's some temp fake event data
			destinationEvent = {
				display_name:"Temp Fake Event",
				start_date:{date:"1993-10-05T12:34:56Z"},
				end_date:{date:"1995-10-05T12:34:56Z"},
				budget:1000000.00,
				location:"123 sesame st",
				hosts:[],
				invites:[{user:"oprah!",friends:[],email:"",phone:0,user_id: 5432},{user:"siddhartha",friends:[],email:"",phone:0,user_id: 5132}],
				accepts:[{user:"kali fornia",friends:[],email:"",phone:0,user_id: 1321},{user:"billy lee",friends:[],email:"",phone:0,user_id: 1233}],
				declines:[],
				comments:[],
				event_id: eventId};

			openEvent(destinationEvent);
		}
	});
}

function openEvent(destinationEvent) {
	localStorage.setItem("eventObj", JSON.stringify(destinationEvent));
	window.location="event.html";
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
			'eventID' : id,
		};

		tempFakeEventData.push(object); //This is only temporary (see below)
		//The below line is what we should actually do
		// notificationArray.push(object);
	}

	return tempFakeEventData; //Again, only temporary (see below)
	// return notificationArray;// Do this
}
