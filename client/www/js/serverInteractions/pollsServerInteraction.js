// Event Polls
// Each event can have zero or more polls

function getEventPolls(eventId, callback){
    var authToken = LetsDoThis.Session.getInstance().getAuthToken();
	var pollsUrl = "http://159.203.12.88/api/events/"+eventId+"/polls/";

	$.ajax({
		type: 'GET',
		url: pollsUrl,
		dataType: 'json',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		success: function (resp) {
			console.log("Received Polls");
			callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});  
}

function addEventPoll(eventId, question, choices, callback){
    // choices is ["Choice 1", "Choice 2", etc...]
    var authToken = LetsDoThis.Session.getInstance().getAuthToken();
    var pollsUrl = "http://159.203.12.88/api/events/"+eventId+"/polls/";
    
    var postData = {
        "question": question,
        "poll_choices": choices
    }
    
	$.ajax({
		type: 'POST',
		url: pollsUrl,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		data: JSON.stringify(postData), 
		contentType: 'application/json',
		dataType: 'json',
		success: function (resp) {
			console.log("Created poll");
			callback(resp);
		},
		error: function(e) {
			console.log("Failed to create poll");
			console.log(e);
		}
	});
}

function getEventPoll(eventId, pollId, callback) {
    var authToken = LetsDoThis.Session.getInstance().getAuthToken();
	var pollUrl = "http://159.203.12.88/api/events/"+eventId+"/polls/"+pollId+"/";

	$.ajax({
		type: 'GET',
		url: pollUrl,
		dataType: 'json',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		success: function (resp) {
			console.log("Received Poll");
			callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});
}

function deleteEventPoll(eventId, pollId, callback) {
    var authToken = LetsDoThis.Session.getInstance().getAuthToken();
    var pollUrl = "http://159.203.12.88/api/events/"+eventId+"/polls/"+pollId+"/";
    
	$.ajax({
		type: 'DELETE',
		url: pollUrl,
		dataType: 'json',
		beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		success: function (resp) {
			console.log("Deleted poll");
            callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});
}

function voteEventPoll(eventId, pollId, vote, callback) {
    // vote is a choice id
    var authToken = LetsDoThis.Session.getInstance().getAuthToken();
    var voteUrl = "http://159.203.12.88/api/events/"+eventId+"/polls/"+pollId+"/vote/";
    
    var postData = {
        "vote": vote
    }
    
	$.ajax({
		type: 'POST',
		url: voteUrl,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		data: JSON.stringify(postData), 
		contentType: 'application/json',
		dataType: 'json',
		success: function (resp) {
            // resp is the entire poll
			console.log("Voted!");
			callback(resp);
		},
		error: function(e) {
			console.log("Vote was unsuccessful");
			console.log(e);
		}
	});
}