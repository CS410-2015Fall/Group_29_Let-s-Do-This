$.getScript("js/global.js", function () {
  $(document).ready( function(){
	// Temp code!
	// When clicking on someone's profile, their user ID will be locally stored
	var someUserId = 13;
	localStorage.setItem("profileId", JSON.stringify({"id":someUserId}));

	// We then retrieve this stored ID and load the profile of this user
	var profileId = JSON.parse( localStorage.getItem("profileId") ).id;
	var userId = LetsDoThis.Session.getInstance().getUserId();

	// if on profile page, display the profile appropriately
	if (window.location.pathname == "/www/profile.html" || window.location.pathname == "/android_asset/www/profile.html") {
        profileToDisplay(profileId, userId);
    }else if (window.location.pathname == "/www/editProfile.html") {
        loadCurrentData();
    }

	// Button logic

	$("#homeButton").click(function(){
		window.location="home.html";
	});

	$("#editButton").click(function(){
		window.location="editProfile.html";
	})

	$("#backButton").click(function(){
		window.location="profile.html";
	})

	$("#saveButton").click(function(){
		var editedUsername = $("#editUsername").val();
		var editedEmail = $("#editEmail").val();
		var editedPhone = $("#editPhone").val();
		editUserData(editedUsername, editedEmail, editedPhone);
	})

	$("#friendButton").click(function(){
		addFriend(userId, profileId, function(resp){
			clearProfile();
			profileToDisplay(profileId);
		})
	})

	$("#unfriendButton").click(function(){
		removeFriend(userId, profileId, function(resp){
			clearProfile();
			profileToDisplay(profileId);
		})
	})
  })
})

function profileToDisplay(profileId, userId) {

	// check if profile belongs to logged in user
	if (profileId == userId) {
		var userData = LetsDoThis.Session.getInstance().getUserInfo();
		console.log("current user");
		loadLoggedInData(userData);
    } else {
		// check if profile belongs to logged in user's friend
		var userFriends = LetsDoThis.Session.getInstance().getUserFriends();
		var isFriend = false;
		var friendData = {};
		$.each(userFriends, function(index, friend){
			if (friend.id == profileId) {
				isFriend = true;
				friendData = friend;
			}
		});
		if (isFriend) {
			console.log("friend");
            loadFriendData(friendData);
        }
		// if neither, this is a stranger's profile
		else {
			getUser(profileId, function(resp){
				console.log("stranger danger!");
				loadStrangerData(resp.username);
			})
		}

    }

}

function loadLoggedInData(userData) {
	$("#editButton").show();
	$("#mainContent").append('<div class="ui-field-contain" id="username"><strong>' + userData.username + '</strong></div>');
	$("#mainContent").append('<div class="ui-field-contain" id="email">Email: '+ userData.email + '</div>');
	$("#mainContent").append('<div class="ui-field-contain" id="phone">Phone: ' + userData.phone + '</div>');
}

function loadFriendData(friendData) {
	$("#unfriendButton").show();
	$("#mainContent").append('<div class="ui-field-contain" id="username"><strong>' + friendData.username + '</strong></div>');
	$("#mainContent").append('<div class="ui-field-contain" id="email">Email: '+ friendData.email + '</div>');
	$("#mainContent").append('<div class="ui-field-contain" id="phone">Phone: ' + friendData.phone + '</div>');
	$("#mainContent").append('<br>'+friendData.username +" is your friend!");

}

function loadStrangerData(username) {
	$("#friendButton").show();
	$("#mainContent").append('<div class="ui-field-contain" id="username"><strong>' + username + '</strong></div>');
	$("#mainContent").append('<br>You and '+username+ " are not friends :( ");
}

function clearProfile() {
	$("#editButton").hide();
	$("#friendButton").hide();
	$("#unfriendButton").hide();
	$("#mainContent").html("");
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
