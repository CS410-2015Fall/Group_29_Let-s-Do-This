var notManager;

document.addEventListener("deviceready", function(){
	notManager = cordova.plugins.notification.local;
	console.log("Notification plugin defined");
}, false);


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
