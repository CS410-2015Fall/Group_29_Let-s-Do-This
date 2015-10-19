var tempFakeNotificationData = [
{head:"Notification1",body:"Tom's going to your christmas party!",eventId:"1"},
{head:"Notification2",body:"Dick invited you to trivia night at the cambie!",eventId:"2"},
{head:"Notification3",body:"Harry's Birthday Party is today!",eventId:"3"},
{head:"Notification4",body:"Sally commented on your christmas party",eventId:"4"}];

var tempFakeEventData = [
{head:"Event1",body:"this is an event on a day",eventId:""},
{head:"Event2",body:"another event on another day",eventId:""},
{head:"Event3",body:"yup, you guessed it",eventId:""},
{head:"These boxes are cool",body:"because they're generated dynamically from an array of strings",eventId:""}];

var tempFakeFriends = ["the styling","is clearly","not loading","correctly","click the x","in \"Filter Items...\"","Tom","Dick","Harry","Sally","Wolfgang","Emil","Mathias","Magnus","Jonas","William","Oliver","Noah","Adrian","Tobias","Elias","Daniel","Henrik","Sebastian","Lucas","Martin","Andreas","Benjamin","Leon","Sander","Alexander","Liam","Isak","Jakob","Kristian","Aksel","Julian","Fredrik","Sondre","Johannes","Erik","Marius","Jonathan","Filip"];


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

    $("#box").click(function(){

    });

    handleContentBoxLinks();
});

function createContentBoxes(boxes) {
    $("#mainContent").html("");
    $.each( boxes, function( index, value ){
        $("#mainContent").append(
            '<div id="box" eventId="'
            + value.eventId
            +'"><p><strong>'
            + value.head
            + '</strong><br>'
            + value.body
            + '</p></div>');
    });
}

function handleContentBoxLinks() {
    $(document).on("click", '#mainContent div', function(e) {
        if ($(this).attr("id") == "box") {
            // generate link from eventId
            alert($(this).attr("eventId"));
        }
    });
}

function loadFriends() {
    $("#friends").html();
    $.each( tempFakeFriends, function( index, value ){
        $("#friendList").append(
            '<li><a href="">'
            + value
            +'</a></li>'
            );
    });
}
