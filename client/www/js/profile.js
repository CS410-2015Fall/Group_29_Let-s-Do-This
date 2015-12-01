
$.getScript("js/global.js", function () {
  initializeScripts(loadProfile);
});


function loadProfile(){
  $(document).ready( function(){
	
	// Retrieve stored ID and load the profile of this user
	var profileId = LetsDoThis.Session.getInstance().getProfileId();
	var userId = LetsDoThis.Session.getInstance().getUserId();
	
	var profileInfo = new ProfileInfo();
    profileInfo.profileToDisplay(profileId, userId);
	
	$("#homeButton").click(function(){
		window.location="home.html";
	});

	$("#editButton").click(function(){
		window.location="editProfile.html";
	});

	$("#friendButton").click(function(){
		addFriend(userId, profileId, function(resp){
			profileInfo.clearProfile();
			profileInfo.profileToDisplay(profileId);
		});
	});

	$("#unfriendButton").click(function(){
		removeFriend(userId, profileId, function(resp){
			profileInfo.clearProfile();
			profileInfo.profileToDisplay(profileId);
		});
	});
  });

};

var ProfileInfo = function() {};

ProfileInfo.prototype.profileToDisplay = function(profileId, userId) {
  
	  // check if profile belongs to logged in user
	  if (profileId == userId) {
		  var userData = LetsDoThis.Session.getInstance().getUserInfo();
		  console.log("current user");
		  this.loadLoggedInData(userData);
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
			  this.loadFriendData(friendData);
		  }
		  // if neither, this is a stranger's profile
		  else {
			  getUser(profileId, function(resp){
				  console.log("stranger danger!");
				  this.loadStrangerData(resp.username);
			  })
		  }
  
	  }
  
};
  
ProfileInfo.prototype.loadLoggedInData = function(userData) {
		$("#editButton").show();
		$("#mainContent").append('<div class="ui-field-contain" id="username"><strong>' + userData.username + '</strong></div>');
		$("#mainContent").append('<div class="ui-field-contain" id="email">Email: '+ userData.email + '</div>');
		$("#mainContent").append('<div class="ui-field-contain" id="phone">Phone: ' + userData.phone + '</div>');
};
  
ProfileInfo.prototype.loadFriendData = function(friendData) {
	  $("#unfriendButton").show();
	  $("#mainContent").append('<div class="ui-field-contain" id="username"><strong>' + friendData.username + '</strong></div>');
	  $("#mainContent").append('<div class="ui-field-contain" id="email">Email: '+ friendData.email + '</div>');
	  $("#mainContent").append('<div class="ui-field-contain" id="phone">Phone: ' + friendData.phone + '</div>');
	  $("#mainContent").append('<br>'+friendData.username +" is your friend!");
  
};
  
ProfileInfo.prototype.loadStrangerData = function(username) {
	  $("#friendButton").show();
	  $("#mainContent").append('<div class="ui-field-contain" id="username"><strong>' + username + '</strong></div>');
	  $("#mainContent").append('<br>You and '+username+ " are not friends :( ");
};
  
ProfileInfo.prototype.clearProfile = function() {
	  $("#editButton").hide();
	  $("#friendButton").hide();
	  $("#unfriendButton").hide();
	  $("#mainContent").html("");
};
  

