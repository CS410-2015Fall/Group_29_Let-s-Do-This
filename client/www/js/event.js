

$(document).ready(function() {
	$("#inviteButton").click(function(){
		var invited = handleInviteCheckBoxes();

		$("#friendsPopup").popup("close");
	});

	$("#backButton").click(function(){
		window.location="home.html";
	});

});

function handleInviteCheckBoxes() {
	var ancestor = document.getElementById('id'),
	descendents = ancestor.getElementsByTagName('*');
	var i, e, d;
	for (i = 0; i < descendents.length; ++i) {
		e = descendents[i];
		// if box is checked, add name to list
	}
}
