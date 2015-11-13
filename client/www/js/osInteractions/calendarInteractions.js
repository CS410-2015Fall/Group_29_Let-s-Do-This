// These functions require the following formats
// start: YYYY-MM-DDThh:mm
// end: YYYY-MM-DDThh:mm

var cal;
$(document).ready(function() {
	console.log('calendarIntercation loaded');
});

document.addEventListener("deviceready", function(){
	cal = window.plugins.calendar;
	console.log("Calender plugin defined");
}, false);

function addEventsToCalendar(events){
	//For all events
	//	Add event to calendar
};

function addEventToCalendar(event){
	var title = 'testEvent';
	var location;
	var notes = 'Lets Do This event';
	var start = new Date(2015, 0, 1, 20, 0, 0, 0, 0);
	var end = new Date(2015, 0, 1, 22, 0, 0, 0, 0);

	cal.createEvent(title, location, notes, start, end);
}

//Checks if this exact event is in the calendar
function checkCalendarForEvent(event){
	//Check if this exact event is in the calendar
	//	Same name, same dates, same times, same location
}

function findAllEvents(){
	console.log(cal.findEvent(null, null, "Lets Do This event"));
}
