var notManager;

document.addEventListener("deviceready", function(){
	notManager = cordova.plugins.notification.local;
	console.log("Notification plugin defined");
}, false);

function notifyOfChange(eventName){
	var title = 'A Lets Do This event has changed!';
	var message = 'Be sure to check ' + eventName + ' to stay up to date!';
	makeNotification(title, message);
}





// Note: This is mostly just a helper function to be used by other functions in this file.
//			 Check to see if there is a more relevant function to use first
// Displays a notification to the user
// 	title: The first line displayed in the notification
// 	message: Additional lines displayed in the notification
function makeNotification(title, message){
	notManager.schedule({
		id: 1,
		title: title,
		text: message,
				// data: null
	});
}
