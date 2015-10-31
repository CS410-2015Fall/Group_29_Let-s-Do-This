

$(document).ready(function() {
	var eventData = JSON.parse( localStorage.getItem("eventObj") );
	loadEventData(eventData);

	$("#inviteButton").click(function(){
		var invited = handleInviteCheckBoxes();

		$("#friendsPopup").popup("close");
	});

	$("#homeButton").click(function(){
		window.location="home.html";
	});

});

function loadEventData(e) {
	$("#eventName").html("<strong>" + e.display_name + "</strong>");

	if (e.end_date == null) {
		$("#dateTime").html("On " + e.start_date.date + " at " + e.start_date.time);
	} else if (e.start_date.date == e.end_date.date) {
		$("#dateTime").html("On " + e.start_date.date + " from " + e.start_date.time + " until " + e.end_date.time);
	} else {
		$("#dateTime").html("From " + e.start_date.date + " at " + e.start_date.time + " until " + e.end_date.date + " at " + e.end_date.time);
	}

	$("#location").html("Location: " + e.location);

//guests
//comments
}

function handleInviteCheckBoxes() {
	var ancestor = document.getElementById('friendsPopup'),
	descendents = ancestor.getElementsByTagName('input');
	var i, e;
	var invited = [];
	for (i = 0; i < descendents.length; ++i) {
		e = descendents[i];
		if (e.checked) {
			invited.push(e.id)
		}
	}
	return invited;
	// TODO ideally we want this function to have some more complicated logic.
	// if guests are already invited, they should already be checked appropriately, if they have already accepted that should be visible and it should not be possible to uncheck (uninvite) them. if there is some kind of userId we should probably use that for the input id field.
}
