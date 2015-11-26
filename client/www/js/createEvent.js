$.getScript("js/global.js", function() {
	$(document).ready(function() {
		var module;
		var eventId = localStorage.getItem("editEvent");
		if(eventId == 0){
			module = CreateEventModule;
		} else {
			module = EditEventModule;
			getEvent(eventId, function(resp) {
				module.init(resp,'nameField', 'dateField', 'startTimeField', 'endTimeField', 'locationField',$("#cancelButton"));
			});
		}

		if (localStorage.getItem("arrivingFromYelp") != 0) {
			LocationModule.loadValuesFromStorage();
			localStorage.setItem("arrivingFromYelp", 0);
		}

		$("#backButton").click(function(){
			module.handleBackButton();
		});

		$("#findLocationButton").click(function(){
			LocationModule.saveValuesToStorage();
			window.location ="venueSearch.html";
		});

		$("#saveButton").click(function(){
			module.handleSaveButton();
		});
	});
});

var LocationModule = {
	//This function is used by the location button to call back on
	setLocation: function(name, address) {
		if(name==null||address==null){ //Ensure neither is null
			throw "Name or address was null when setting location";
		}
		$("#locationField").val(name + ": " + address); //Set the location box
	},


	saveValuesToStorage: function() {
		//changing page will cause us to lose all our values
		//so save everything in the textboxes to storage to restore later

		//Get the current values
		var name = document.getElementById('nameField').value;
		var date = document.getElementById('dateField').value;
		var startTime = document.getElementById('startTimeField').value;
		var endTime = document.getElementById('endTimeField').value;
		var location = document.getElementById('locationField').value;

		//Put them in storage
		localStorage.setItem("currentEventName", name);
		localStorage.setItem("currentEventDate", date);
		localStorage.setItem("currentEventStart", startTime);
		localStorage.setItem("currentEventEnd", endTime);
		localStorage.setItem("currentEventLocation", location);
	},

	//Load previous values back into the textboxes
	loadValuesFromStorage: function() {
		document.getElementById('nameField').value = localStorage.getItem("currentEventName");
		document.getElementById('dateField').value = localStorage.getItem("currentEventDate");
		document.getElementById('startTimeField').value = localStorage.getItem("currentEventStart");
		document.getElementById('endTimeField').value = localStorage.getItem("currentEventEnd");

		//Do we have a new location due to venueSearch?
		if (localStorage.getItem("arrivingFromYelp") == 1){
			//came from the venueSearch with new location, load stored values
			document.getElementById('locationField').value =
			localStorage.getItem("yelpLocationName") + ": " +
			localStorage.getItem("yelpLocationAddress");
		} else {
			// if arrivingFromYelp == -1 we didn't choose a new location
			document.getElementById('locationField').value =
			localStorage.getItem("currentEventLocation");
		}
	}
};

var CreateEventModule = {

	handleBackButton: function() {
		window.location="home.html";
	},

	handleSaveButton: function() {
		var e = new BuildEventObj();
		if (e.display_name != "" && e.start_date != "") {
			this.newEvent(e);
		} else {
			// throw up some message? idk.
		}
	},

	newEvent: function(e) {
		sendToServer(e.display_name, e.start_date, e.end_date, null, e.location, function(newEvent){
			openEvent(newEvent.id);
		});
	}
};

var EditEventModule = {

	eventId: -1,

	init: function(e, nameField, dateField, startTimeField, endTimeField, locationField,cancelButtonDiv) {
		this.eventId = e.id;

		document.getElementById(nameField).value = e.display_name;
		var start = e.start_date.split("T");
		document.getElementById(dateField).value = start[0];
		document.getElementById(startTimeField).value = start[1];
		var end = e.end_date.split("T");
		document.getElementById(endTimeField).value = end[1];
		document.getElementById(locationField).value = e.location;

		this.initCancelButton(cancelButtonDiv);
	},

	initCancelButton: function(cancelButtonDiv) {
		var button = $('<button id="cancelEventButton" data-theme="b" onclick="alert("");">Cancel Event</button>');

		cancelButtonDiv.append(button);
		cancelButtonDiv.trigger('create');

		button.click(function(){
			EditEventModule.handleCancelButton();
		});
	},

	handleCancelButton: function() {
		cancelEvent(this.eventId, function(resp){
			window.location="home.html";
			alert("cancello!");
		});
	},

	handleBackButton: function() {
		window.location="event.html";
	},

	handleSaveButton: function() {
		var e = new BuildEventObj();
		// if (e.display_name != "" && e.start_date != "") {
			this.updateEvent(e);
		// } else {
			// throw up some message? idk.
		// }

	},

	updateEvent: function(e) {
		editEvent(this.eventId, e.display_name, e.start_date, e.end_date, null, e.location, function(resp) {
			openEvent(resp.id);
		});
	}
};

function BuildEventObj() {
	this.display_name = document.getElementById('nameField').value;
	var date = document.getElementById('dateField').value;
	var startTime = document.getElementById('startTimeField').value;
	var endTime = document.getElementById('endTimeField').value;
	this.location = document.getElementById('locationField').value;
	// This function assumes a format of:
	// Date: YYYY-MM-DD
	// Time: hh:mm
	// and outputs YYYY-MM-DDThh:mm
	function formatTime(date, time){
		if (date != "" && time != "") {
			return date.concat('T').concat(time);
		} else {
			return "";
		}
	}
	this.start_date = formatTime(date, startTime);
	this.end_date = formatTime(date, endTime);
};
