$.getScript("js/global.js", function () {
  initializeScripts(loadEditProfile);
});

function loadEditProfile(){
  $(document).ready( function(){

	  // load edit profile fields
	  loadCurrentData();

	  // Button logic

	  $("#homeButton").click(function(){
		  window.location="home.html";
	  });

	  $("#backButton").click(function(){
		  window.location="profile.html";
	  })

	  $("#saveButton").click(function(){
		  var editedUsername = $("#editUsername").val();
		  var editedEmail = $("#editEmail").val();
		  var editedPhone = $("#editPhone").val();
		  editUserData(editedUsername, editedEmail, editedPhone);
	  })
	})
}

function loadCurrentData(){
	var userData = LetsDoThis.Session.getInstance().getUserInfo();
	$("#editUsername").val(userData.username);
	$("#editEmail").val(userData.email);
	$("#editPhone").val(userData.phone);
}

function editUserData(editedUsername, editedEmail, editedPhone) {
	var userId = LetsDoThis.Session.getInstance().getUserId();
	console.log("about to update user info");
	updateUserInfo(userId, editedUsername, editedEmail, editedPhone, function(resp){
		window.location="profile.html";
	})
}

function clearProfile() {
	$("#editButton").hide();
	$("#friendButton").hide();
	$("#unfriendButton").hide();
	$("#mainContent").html("");
}