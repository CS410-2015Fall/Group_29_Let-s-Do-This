var tempFakeNotificationData = [
{head:"Christmas Party",body:"Tom is attending",boxId:"1"},
{head:"Trivia Night at The Biltmore",body:"Dick invited you",boxId:"2"},
{head:"Harry's Birthday Party",body:"Is today at 19:30",boxId:"3"},
{head:"Christmas Party",body:"Sally commented",boxId:"4"}];

$(document).ready(function() {
	//Get the script to get events
	// $.getScript("js/serverInteractions/eventServerInteraction.js");
	$.getScript("js/osInteractions/calendarInteractions.js");
	// console.log("isCordova: " + LetsDoThis.Session.getInstance().getIsCordova);
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
		var message = convertDate(eventArray[i].start_date,eventArray[i].end_date);

		var object = {
			'head' : name,
			'body' : message,
			'boxId' : id,
		};

		notificationArray.push(object);
	}

	return notificationArray;// Do this
}
