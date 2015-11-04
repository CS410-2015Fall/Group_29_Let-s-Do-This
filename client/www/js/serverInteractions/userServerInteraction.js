$(document).ready(function() {
	console.log('userServerInt loaded');
});

function getUser(userId, callback){
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
	var userUrl = "http://159.203.12.88/api/users/"+userId+"/";

	$.ajax({
		type: 'GET',
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
