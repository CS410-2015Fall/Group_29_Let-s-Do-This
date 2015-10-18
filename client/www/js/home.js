var tempFakeNotificationData = [
{head:"Notification1",body:"Tom's going to your christmas party!"},
{head:"Notification2",body:"Dick invited you to trivia night at the cambie!"},
{head:"Notification3",body:"Harry's Birthday Party is today!"},
{head:"Notification4",body:"Sally commented on your christmas party"}];

var tempFakeEventData = [
{head:"Event1",body:"this is an event on a day"},
{head:"Event2",body:"another event on another day"},
{head:"Event3",body:"yup, you guessed it"},
{head:"These boxes are cool",body:"because they're generated dynamically from an array of strings"}];

var friends = ["the styling","is clearly","not loading","correctly","click the x","in \"Filter Items...\"","Tom","Dick","Harry","Sally","Wolfgang","Emil","Mathias","Magnus","Jonas","William","Oliver","Noah","Adrian","Tobias","Elias","Daniel","Henrik","Sebastian","Lucas","Martin","Andreas","Benjamin","Leon","Sander","Alexander","Liam","Isak","Jakob","Kristian","Aksel","Julian","Fredrik","Sondre","Johannes","Erik","Marius","Jonathan","Filip"];


$(document).ready(function() {
    createContentBoxes(tempFakeNotificationData);
    loadFriends();

    $("#notificationsButton").click(function(){
        createContentBoxes(tempFakeNotificationData);
    });
    $("#eventsButton").click(function(){
        createContentBoxes(tempFakeEventData);
    });
    $("#calendarButton").click(function(){
        $("#mainContent").html("");
        $("#mainContent").append("<strong>TODO</strong>");
    });
    $("#createEventButton").click(function(){
        window.location="createEvent.html";
    });
    $("#profileButton").click(function(){

    });
    $("#friendsButton").click(function(){
    });
});

function createContentBoxes(boxes) {
    $("#mainContent").html("");
    $.each( boxes, function( index, value ){
        $("#mainContent").append(
            '<div id="box"><p><strong>'
            + value.head
            + '</strong><br>'
            + value.body
            + '</p></div>');
    });
}

function loadFriends() {
    $("#friends").html();
    $.each( friends, function( index, value ){
        $("#friendList").append(
            '<li><a href="">'
            + value
            +'</a></li>'
            );
    });
}
