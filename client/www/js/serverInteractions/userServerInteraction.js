$(document).ready(function() {
	// console.log('userServerInt loaded');
});

function getUser(userId, callback){
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
	var userUrl = "http://159.203.12.88/api/users/"+userId+"/";

	$.ajax({
		type: 'GET',
		async: false,
		url: userUrl,
		dataType: 'json',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		success: function (resp) {
			console.log("Received user");
			callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});
}

function getAllUsers(callback){
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
	
	$.ajax({
		type: 'GET',
		url: "http://159.203.12.88/api/users/",
		dataType: 'json',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		success: function(resp) {
			callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});
}

function createUser(username, password, email, phone, callback){
	
    var postData = {
        "username": username,
        "password": password,
        "email": email,
		"phone": phone
    }; 
    
	$.ajax({
		type: 'POST',
		url: "http://159.203.12.88/api/users/new/",
		dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(postData),
		success: function (resp) {
			console.log("user created");
			callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});
}

function updateUserInfo(userId, username, email, phone, callback){
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
    var userUrl = "http://159.203.12.88/api/users/"+userId+"/";
    
    var putData = {
        "username": username,
        "email": email,
		"phone": phone
    }
	console.log("userId is "+userId);
    console.log("username is "+username);
	console.log("email is "+email);
	console.log("phone is "+phone);
	
	$.ajax({
		type: 'PUT',
		url: userUrl,
		dataType: 'json',
		contentType: 'application/json',
		beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
        data: JSON.stringify(putData),
		success: function (resp) {
			console.log("Updated user info");
			LetsDoThis.Session.getInstance().setUserInfo({
				"id": userId,
				"username": resp.username,
				"email": resp.email,
				"phone": resp.phone
			});
			callback(resp);
		},
		error: function(e) {
			console.log("Did not update user info");
			console.log(e);
		}
	});
}

function addFriend(userId, friendId, callback) {
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
    var userUrl = "http://159.203.12.88/api/users/"+userId+"/";
    
	var friend = [friendId.toString()];
	
    var putData = {
        "friends": friend
    }
    
	$.ajax({
		type: 'PUT',
		url: userUrl,
		dataType: 'json',
		contentType: 'application/json',
		beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
        data: JSON.stringify(putData),
		success: function (resp) {
			console.log("Added as friend");
			LetsDoThis.Session.getInstance().setUserFriends({
                "friends":resp.friends
            });
			callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});
}

function removeFriend(userId, friendId, callback) {
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
	
	var removeUrl = "http://159.203.12.88/api/users/"+userId+"/friends/remove/";
	
	var friend = [friendId];

    var postData = {
        "friends": friend
    }; 
    
	$.ajax({
		type: 'POST',
		url: removeUrl,
		dataType: 'json',
        contentType: 'application/json',
		beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
        data: JSON.stringify(postData),
		success: function (resp) {
			console.log("friend removed");
			LetsDoThis.Session.getInstance().setUserFriends({
                "friends":resp.friends
            });
			callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});
}

function deleteUser(userId, callback) {
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
    var userUrl = "http://159.203.12.88/api/users/"+userId+"/";
    
	$.ajax({
		type: 'DELETE',
		url: userUrl,
		dataType: 'json',
		beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		success: function (resp) {
			console.log("Deleted user");
			callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});
}