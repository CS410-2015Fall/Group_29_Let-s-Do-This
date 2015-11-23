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

function createUser(username, password, email, phone){
	// new users start off with no friends :(
	// var authToken = LetsDoThis.Session.getInstance().getAuthToken();
	
    var postData = {
        "username": username,
        "password": password,
        "email": email,
		"phone": phone
    }; 
    
	$.ajax({
		type: 'POST',
		url: "http://159.203.12.88/api/users",
		dataType: 'json',
        contentType: 'application/json',
		//beforeSend: function(xhr) {
		//		xhr.setRequestHeader("Authorization", "JWT " + authToken);
		//},
        data: JSON.stringify(postData),
		success: function (resp) {
			console.log("user created");
		},
		error: function(e) {
			console.log(e);
		}
	});
}

function updateUserInfo(userId, username, password, email, phone, callback){
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
    var userUrl = "http://159.203.12.88/api/users/"+userId+"/";
    
    var putData = {
        "username": username,
        "password": password,
        "email": email,
		"phone": phone
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
			console.log("Updated user info");
			callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});
}

function addFriends(userId, friendIds, callback) {
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
    var userUrl = "http://159.203.12.88/api/users/"+userId+"/";
    
    var putData = {
        "friends": friendIds
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
		},
		error: function(e) {
			console.log(e);
		}
	});
}

function removeFriends(userId, friendIds) {
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
	
	var userUrl = "http://159.203.12.88/api/users/"+userId+"/friends/remove/";
	
    var postData = {
        "friends": friendIds
    }; 
    
	$.ajax({
		type: 'POST',
		url: userUrl,
		dataType: 'json',
        contentType: 'application/json',
		beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
        data: JSON.stringify(postData),
		success: function (resp) {
			console.log("friends removed");
		},
		error: function(e) {
			console.log(e);
		}
	});
}

function deleteUser(userId) {
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
    var userUrl = "http://159.203.12.88/api/users/"+userId+"/";
    
	$.ajax({
		type: 'DELETE',
		url: userUrl,
		dataType: 'json',
		beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		success: function () {
			console.log("Deleted user");
		},
		error: function(e) {
			console.log(e);
		}
	});
}