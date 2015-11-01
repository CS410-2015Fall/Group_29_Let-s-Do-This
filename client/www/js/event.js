$(document).ready(function() {
	var eventData = JSON.parse( localStorage.getItem("eventObj") );
	loadEventData(eventData);

	$("#inviteButton").click(function(){
		var invited = getGuestValues();
		$("#friendsPopup").popup("close");
	});

	$("#homeButton").click(function(){
		window.location="home.html";
	});

	$("#commentForm").submit(function(event) {
		event.preventDefault(); //do not redirect page

		var newComment = {
			author: "",
			post_date: {date:"monday",time:"noon"},
			content: $('textarea#commentTextArea').val()};

		var list = eventData.comments;

		list.push(newComment);

		// update server
		// update UI
		var tempDrunkListVariableName = formatComments(list);
		createContentBoxes(tempDrunkListVariableName,$("#comments"));


		$('textarea#commentTextArea').val("");
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
var comments = formatComments(e.comments);
 createContentBoxes(comments,$("#comments"));
}

function formatComments(comments) {
	var formattedComments = [];
	$.each( comments, function( index, comment ){
		var h = comment.author + " commented at " + comment.post_date.time + " on " + comment.post_date.date;

		var c = {head: h,
				body:comment.content,
				eventId:""};
		formattedComments.push(c);
	});
	return formattedComments;
}

function getGuestValues() {
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
