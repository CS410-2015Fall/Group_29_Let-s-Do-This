var notManager;
var isCordovaApp = !!window.cordova;
var id = 1;

var titleQueue = [];
var messageQueue = [];

document.addEventListener("deviceready", function(){
	notManager = cordova.plugins.notification.local;
	console.log("Notification plugin defined");

	//Check if the queue is empty, and run everything if it is not
	for(var i = 0; i<titleQueue.length; i++){
		makeNotification(titleQueue[i], messageQueue[i]);
	}
}, false);

function notifyOfChange(eventName){
	if(!isCordovaApp){
		return;
	}
	var title = 'A Lets Do This event has changed!';
	var message = 'Be sure to check ' + eventName + ' to stay up to date!';

	if(notManager){
		makeNotification(title, message);
	} else {
		//Notification manager hasn't been created yet. Queue it all up
		titleQueue.push(title);
		messageQueue.push(message);
	}

}

function notifyOfNewFriend(friendsName){
	if(!isCordovaApp){
		return;
	}
	var title = 'New Lets Do This friend!';
	var message = friendsName + ' added you as a friend on Lets Do This';


	if(notManager){
		makeNotification(title, message);
	} else {
		//Notification manager hasn't been created yet. Queue it all up
		titleQueue.push(title);
		messageQueue.push(message);
	}
}



// Note: This is mostly just a helper function to be used by other functions in this file.
//			 Check to see if there is a more relevant function to use first
// Displays a notification to the user
// 	title: The first line displayed in the notification
// 	message: Additional lines displayed in the notification
function makeNotification(title, message){
	notManager.schedule({
		id: id++,
		title: title,
		text: message,
		// data: null
	});
}
