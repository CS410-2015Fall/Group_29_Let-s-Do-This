// The following parameters must follow the specified formatting:
// post_date: YYYY-MM-DDThh:mm
//
// TODO:
// TEST!!!

function addComment(eventId, author, post_date, content) {
    var authToken = LetsDoThis.Session.getInstance().getAuthToken();
	var commentUrl = "http://159.203.12.88/api/events/"+eventId+"/comments/";
	
    var postData = {
        "author": author,
        "post_date": post_date,
        "content": content
    }; 
    
	$.ajax({
		type: 'POST',
		url: commentUrl,
		dataType: 'json',
        contentType: 'application/json',
		beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
        data: JSON.stringify(postData),
		success: function (resp) {
			console.log("comment added");
		},
		error: function(e) {
			console.log(e);
		}
	});
}

function getAllComments(eventId, callback) {
   	var authToken = LetsDoThis.Session.getInstance().getAuthToken();

    var commentUrl = "http://159.203.12.88/api/events/"+eventId+"/comments/";

	$.ajax({
		type: 'GET',
		url: commentUrl,
		dataType: 'json',
		beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		success: function (resp) {
			console.log("Received comments");
			callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});
}

function getComment(eventId, commentId) {
   	var authToken = LetsDoThis.Session.getInstance().getAuthToken();

    var commentUrl = "http://159.203.12.88/api/events/"+eventId+"/comments/"+commentId+"/";
    
	$.ajax({
		type: 'GET',
		url: commentUrl,
		dataType: 'json',
		beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		success: function (resp) {
			console.log("Received comment");
			callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});
}



function updateComment(eventId, author, post_date, content, commentId) {
   	var authToken = LetsDoThis.Session.getInstance().getAuthToken();

    var commentUrl = "http://159.203.12.88/api/events/"+eventId+"/comments/"+commentId+"/";
    
    var postData = {
        "author": author,
        "post_date": post_date,
        "content": content
    }
    
	$.ajax({
		type: 'PUT',
		url: commentUrl,
		dataType: 'json',
		contentType: 'application/json',
		beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
        data: JSON.stringify(postData),
		success: function (resp) {
			console.log("Updated comment");
			callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});
}

function deleteComment(eventId, commentId) {
   	var authToken = LetsDoThis.Session.getInstance().getAuthToken();

    var commentUrl = "http://159.203.12.88/api/events/"+eventId+"/comments/"+commentId+"/";
    
	$.ajax({
		type: 'DELETE',
		url: commentUrl,
		dataType: 'json',
		beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		success: function (resp) {
			console.log("Deleted comment");
			callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});
}