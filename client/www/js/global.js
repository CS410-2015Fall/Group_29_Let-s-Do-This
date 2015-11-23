$.getScript("js/user/login-controller.js");
$.getScript("js/user/session.js");
$.getScript("js/serverInteractions/eventServerInteraction.js");
$.getScript("js/serverInteractions/commentServerInteraction.js");
$.getScript("js/serverInteractions/userServerInteraction.js");

//UI
function Box(head, body, id) {
	this.head = head;
	this.body = body;
	this.boxId = id;
};

Box.prototype.toHtml = function toHtml() {
	return '<div id="box" boxId="'
	+ this.boxId
	+ '"><p><strong>'
	+ this.head
	+ '</strong><br>'
	+ this.body
	+ '</p></div>';
};

function displayBoxes(boxes, target) {
	var boxHtml = "";
	$.each( boxes, function (i, val) {
		boxHtml += val.toHtml();
	})
	target.html(boxHtml);
}

//navigation
function openEvent(destinationEvent) {
	localStorage.setItem("eventObj", JSON.stringify(destinationEvent));
	window.location="event.html";
}

// conversion
function convertDate(dateString1,dateString2) {
	// takes two DateTime strings, "YYYY-MM-DDTHH:MM:SSZ"
	// returns a string which reads more nicely
	var start = new Date(dateString1);
	var end = new Date(dateString2);

	if (typeof end === 'undefined') {
		return convertDate(dateString1);
	}

	if (start.getDate() == end.getDate()) {
		return "On " + start.toDateString() + " from " + convertTime(start) + " until " + convertTime(end);
	} else {
		return "From " + start.toDateString() + " at " + convertTime(start) + " until " + end.toDateString() + " at " + convertTime(end);
	}

	// var now = currentDate();
	// if (now.getFullYear() != dateObject.getFullYear()) {

	// } else {

	// }
}

function convertDate(dateString) {
	var dateObject = new Date(dateString);

	var time = convertTime(dateObject)
	var date = dateObject.toDateString();
	return date + " at " + time;
}

function convertTime(dateObject) {
	var hour = dateObject.getHours();
	var minute = dateObject.getMinutes();
	if (minute < 10) {
		minute = "0" + minute;
	}
	return "" + hour + ":" + minute;
}

function currentDate() {
	return new Date($.now());
}
