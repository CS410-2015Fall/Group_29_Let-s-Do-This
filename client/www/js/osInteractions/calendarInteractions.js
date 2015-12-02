// These functions require the following formats
// start: YYYY-MM-DDThh:mm
// end: YYYY-MM-DDThh:mm
var ldtIdentifier = "Lets Do This event"
var cal;
var isCordova = false;

//Makes a queue for when we try to add events before Cordova is ready
var eventQueue = [];
$(document).ready(function() {
	console.log('calendarIntercation loaded');
});

document.addEventListener("deviceready", function(){
	isCordova = true;
	cal = window.plugins.calendar;
	console.log("Calender plugin defined");

	if(eventQueue.length!=0){
		console.log("Events are queued for the calendar");
		addEventsToCalendar(eventQueue);
	}
}, false);


// Deletes all LDT events from the users calendar, and proceeds to readd all events passed in
// each event must be formatted as shown in the bottom of the page
function addEventsToCalendar(events){
	if(!isCordova){ //Check to see if we are on a cordova device or just a browser
		return;
	}

	if(!cal){
		console.log("queueing events for calendar");
		eventQueue = eventQueue.concat(events);
	}

	deleteAllLDTEvents();
	//First check to see if theres any events to deal with
	if(events.length == 0){
		console.log("No events to add to calendar");
		return; //No events, get out!
	}
	console.log("Preparing to add " + events.length + " events to the calendar");

	for(i=0; i<events.length; i++){
		addEventToCalendar(events[i]);
	}
}

// Adds an individual event to the native calendar
// event must be in the format listed at the bottom of the page
function addEventToCalendar(event){
	if(!isCordova){ //Check to see if we are on a cordova device or just a browser
		return;
	}
	//See the format of event at the bottom of the page
	var title = event.display_name + ": " + ldtIdentifier;
	var location = event.location;
	var notes = 'Lets Do This event';
	var start = new Date(event.start_date);//utcToJSDate(event.start_date);
	var end = new Date(event.end_date);//utcToJSDate(event.end_date);

	console.log('This event goes from ' + start + " to " + end);
	cal.createEvent(title, location, notes, start, end);
}

// Searches the users calendar and deletes all LDT events
function deleteAllLDTEvents(){
	if(!isCordova){ //Check to see if we are on a cordova device or just a browser
		return;
	}
	//We have to delete events within a specific range.
	var yearRange = 4; //This is the +/- from todays date

	//Set the ranges
	var startDate = new Date();
	startDate.setFullYear(startDate.getFullYear() - 4);
	var endDate = new Date();
	endDate.setFullYear(endDate.getFullYear() + 4);

	//CAUTION: Misuse of deleteEvent can result in silently deleting your entire calendar
	//Delte events in that range
	cal.deleteEvent(ldtIdentifier, null, null, startDate, endDate, success, error);

	//Set callbacks
	function success(msg){
		console.log("Deleted " + msg.length + " LDT events");
	}
	function error(msg){
		console.log("Failed to delete LDT events");
		console.log(msg);
	}
}

//Takes the UTC format we use and converts it to a JS date
//		utc is formatted such as "1993-10-03T22:20:00Z"
function utcToJSDate(utc){
	var utcDate = utc.split("T")[0];// "1993-10-03"
	var utcTime = utc.split("T")[1];// "22:20:00Z"
	console.log(utcDate + " - " + utcTime);
	var year = utcDate.split("-")[0];
	var month = utcDate.split("-")[1] - 1; //JS Date function is zero based. Thus january is month 0.
	var day = utcDate.split("-")[2] - 1;
	console.log(year + "-" + month + "-" + day);
	var hour = utcTime.split(":")[0];
	var minute = utcTime.split(":")[1];
	console.log(hour + "-" + minute);
	//Anyone who bothers to put seconds deserves a solid slap

	// console.log(year + " - " + month + " - " + day);
	// console.log(hour + " - " + minute);
	return new Date(year, month, day, hour, minute);
}

// ---------------------------------------------------------------------
// Calendar plugin returns objects in the  format:
// allday: false
// endDate: "2016-01-01 22:00:00"
// id: "1578"
// location: ""
// message: ""
// startDate: "2016-01-01 20:00:00"
// title: "test1"

// We store events in the following format (getEvents returns this format)
// accepts: Array[0]
// budget: null
// comments: Array[0]
// declines: Array[0]
// display_name: "let"
// end_date: "1993-10-03T23:15:00Z"
// hosts: Array[1]
// id: 5
// invites: Array[0]
// location: ""
// shopping_list: null
// start_date: "1993-10-03T22:20:00Z"
