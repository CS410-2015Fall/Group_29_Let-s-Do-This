$(document).ready(function() {
	var eventData = JSON.parse( localStorage.getItem("eventObj") );
	loadEventData(eventData);

	$("#inviteButton").click(function(){
		var invited = getGuestCheckboxValues();
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
		var uiFormattedComments = formatComments(list);
		createContentBoxes(uiFormattedComments,$("#comments"));


		$('textarea#commentTextArea').val("");
	});
});

function loadEventData(e) {
	$("#eventName").html("<strong>" + e.display_name + "</strong>");

	if (e.end_date.time == "") {
		$("#dateTime").html("On " + e.start_date.date + " at " + e.start_date.time);
	} else if (e.start_date.date == e.end_date.date) {
		$("#dateTime").html("On " + e.start_date.date + " from " + e.start_date.time + " until " + e.end_date.time);
	} else {
		$("#dateTime").html("From " + e.start_date.date + " at " + e.start_date.time + " until " + e.end_date.date + " at " + e.end_date.time);
	}

	$("#location").html("Location: " + e.location);
//guests
loadGuests(e);

var comments = formatComments(e.comments);
createContentBoxes(comments,$("#comments"));
}

function loadGuests(event) {
	var friendIds = []; //TODO get list of friends

	// reduce friendIds so that it contains only those ids which are not already hosting, invited, attending or declining the event
	$.each(event.hosts, function(index, val) {
		friendIds = jQuery.grep(friendIds, function(value) {
			return value != val;
		});
	});
	$.each(event.invites, function(index, val) {
		friendIds = jQuery.grep(friendIds, function(value) {
			return value != val;
		});
	});
	$.each(event.accepts, function(index, val) {
		friendIds = jQuery.grep(friendIds, function(value) {
			return value != val;
		});
	});
	$.each(event.declines, function(index, val) {
		friendIds = jQuery.grep(friendIds, function(value) {
			return value != val;
		});
	});

	// get user information corresponding to the userIds
	var hosts = $.map(event.hosts, function(val,key){return getItem(val);});
	var accepts = $.map(event.accepts, function(val,key){return getItem(val);});
	var invites = $.map(event.invites, function(val,key){return getItem(val);});
	var friends = $.map(friendIds, function(val,key){return getItem(val);});
	var declines = $.map(event.declines, function(val,key){return getItem(val);});

	// TEMP FAKE DATA
	hosts = [{user:"ted furgusun",friends:[],email:"",phone:0,user_id: 1234}];
	accepts = [{user:"kali fornia",friends:[],email:"",phone:0,user_id: 1321},
		{user:"billy lee",friends:[],email:"",phone:0,user_id: 1233}];
	invites = [{user:"oprah!",friends:[],email:"",phone:0,user_id: 5432},
		{user:"siddhartha",friends:[],email:"",phone:0,user_id: 5132}];
	friends = [{user:"mario",friends:[],email:"",phone:0,user_id: 6354},
		{user:"luigi",friends:[],email:"",phone:0,user_id: 9448},
		{user:"toad",friends:[],email:"",phone:0,user_id: 0987}];
	declines = [{user:"bowser",friends:[],email:"",phone:0,user_id: 1233}];
	updateGuestListUi(hosts,accepts,invites,friends,declines);
}

function updateGuestListUi(hosts,accepts,invites,friends,declines) {
	//create html for list of users associated with event
	var s = "";
	$.each(hosts, function( i, user) {
		s = s.concat('<label for="' + user.user_id + '">' + user.user + ' (host)</label><input type="checkbox" name="host" checked="true" disabled="true" id="' + user.user_id + '" value="' + user.user_id + '">');
	});
	$.each(accepts, function( i, user) {
		s = s.concat('<label for="' + user.user_id + '">' + user.user + ' (attending)</label><input type="checkbox" name="accept" id="' + user.user_id + '" value="' + user.user_id + '" checked="true" disabled="true">');
	});
	$.each(invites, function( i, user) {
		s = s.concat('<label for="' + user.user_id + '">' + user.user + ' (invited)</label><input type="checkbox" name="invite" id="' + user.user_id + '" value="' + user.user_id + '" checked="true">');
	});
	$.each(friends, function( i, user) {
		s = s.concat('<label for="' + user.user_id + '">' + user.user + '</label><input type="checkbox" name="friend" id="' + user.user_id + '" value="' + user.user_id + '">');
	});
	$.each(declines, function( i, user) {
		s = s.concat('<label for="' + user.user_id + '">' + user.user + ' (not attending)</label><input type="checkbox" name="decline" id="' + user.user_id + '" value="' + user.user_id + '" checked="false" disabled="true">');
	});

	// write giant string of html to DOM
	$("fieldset#friendsPopup").html(s);
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

function getGuestCheckboxValues() {
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
