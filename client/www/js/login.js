
$(document).ready(function() {
	$("#loginButton").click(function(){
		var email = document.getElementById('emailField').value;
		var password = document.getElementById('passwordField').value;
		var loginInfo = {email,password};
		// if login is good, pull user info, go to home screen
		window.location="home.html";
	});
});
