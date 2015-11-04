$(document).ready(function() {
    var eventData = JSON.parse( localStorage.getItem("eventObj") );
    loadEventData(eventData);

    $("#inviteButton").click(function(){
        var invited = getGuestCheckboxValues();
        $("#friendsPopup").popup("close");
    });

    $("#homeButton").click(function(){
        window.location="home.html";
    });

    $("#rsvpButton").click(function(){
        var userId = 0; // get users's own userId
        // TODO change rsvp status for user in event on server
        $("#rsvpButton").attr('disabled', 'true');
        $("#rsvpPopup").popup( "open" )
    });

    $("#commentForm").submit(function(event) {
        event.preventDefault(); //do not redirect page
        var currentDateTime = currentDate();
        var author = LetsDoThis.Session.getInstance().getUserInfo().username;
        var newComment = {
            author: author,
            post_date: currentDateTime,
            content: $('textarea#commentTextArea').val()
        };
        postComment(eventData,newComment);
    });
});

function loadEventData(e) {
    $("#eventName").html("<strong>" + e.display_name + "</strong>");

    var start = new Date(e.start_date);
    var end = new Date(e.end_date);

    if (e.end_date == "") {
        $("#dateTime").html("On " + convertDate(start) + " at " + convertTime(start));
    } else if (start.getDate() == end.getDate()) {
        $("#dateTime").html("On " + convertDate(start) + " from " + convertTime(start) + " until " + convertTime(end));
    } else {
        $("#dateTime").html("From " + convertDate(start) + " at " + convertTime(start) + " until " + convertDate(end) + " at " + convertTime(end));
    }

    $("#location").html("Location: " + e.location);

    loadGuests(e);

    // TODO
    // if (you yourself are already a host or marked as attending) {
        // $("#rsvpButton").attr('disabled', 'true');
    // }

    var comments = formatComments(e.comments);
    createContentBoxes(comments,$("#comments"));
}

function loadGuests(event) {
    var friendIds = []; //TODO get list of friends

    // reduce friendIds so that it contains only those ids which are not already invited, attending or declining the event
    function reduceList(l1,l2) {
        $.each(l2, function(index, val) {
            l1 = jQuery.grep(l1, function(value) {
                return value != val;
            });
        });
        return l1;
    }
    var all = [1,2,3,4,5,6];
    var evens = [2,4,6,8,10];

    friendIds = reduceList(friendIds,event.invites);
    friendIds = reduceList(friendIds,event.accepts);
    friendIds = reduceList(friendIds,event.declines);

    // get user information corresponding to the userIds
    var accepts = $.map(event.accepts, function(val,key){return getUser(val);});
    var invites = $.map(event.invites, function(val,key){return getUser(val);});
    var friends = $.map(friendIds, function(val,key){return getUser(val);});
    var declines = $.map(event.declines, function(val,key){return getUser(val);});

// TEMP FAKE DATA
    friends = [{user:"mario",friends:[],email:"",phone:0,user_id: 6354},{user:"luigi",friends:[],email:"",phone:0,user_id: 9448},{user:"toad",friends:[],email:"",phone:0,user_id: 0987}];
    invites = [{user:"oprah!",friends:[],email:"",phone:0,user_id: 5432},{user:"siddhartha",friends:[],email:"",phone:0,user_id: 5132}];
    accepts = [{user:"kali fornia",friends:[],email:"",phone:0,user_id: 1321},{user:"billy lee",friends:[],email:"",phone:0,user_id: 1233}];
    declines = [{user:"bowser",friends:[],email:"",phone:0,user_id: 12533}];

    updateGuestListUi(accepts,invites,friends,declines);
}

function updateGuestListUi(accepts,invites,friends,declines) {
    //create html for list of users associated with event
    var s = "";
    $.each(accepts, function( i, user) {
        $("fieldset#friendsPopup").append('<input type="checkbox" name="accept" id="' + user.user_id + '" value="' + user.user_id + '" checked="true" disabled="true"><label for="' + user.user_id + '">' + user.user + ' (attending)</label>');
    });
    $.each(invites, function( i, user) {
        $("fieldset#friendsPopup").append('<input type="checkbox" name="invite" id="' + user.user_id + '" value="' + user.user_id + '" checked="true"><label for="' + user.user_id + '">' + user.user + '</label>');
    });
    $.each(friends, function( i, user) {
        $("fieldset#friendsPopup").append('<input type="checkbox" name="friend" id="' + user.user_id + '" value="' + user.user_id + '"><label for="' + user.user_id + '">' + user.user + '</label>');
    });
    $.each(declines, function( i, user) {
        $("fieldset#friendsPopup").append('<input type="checkbox" name="decline" id="' + user.user_id + '" value="' + user.user_id + '" checked="false" disabled="true"><label for="' + user.user_id + '">' + user.user + ' (not attending)</label>');
    });
}

function getGuestCheckboxValues() {
    var ancestor = document.getElementById('friendsPopup'),
    descendents = ancestor.getElementsByTagName('input');
    var i, e;
    var invited = [];
    for (i = 0; i < descendents.length; ++i) {
        e = descendents[i];
        if (e.checked) {
            invited.push(e.id)
        }
    }
    return invited;
}

function postComment(event, comment) {
    // send comment to server
    // addComment(event.event_id,
    //     comment.author,
    //     comment.post_date,
    //     comment.content);

    // update UI
    var comments = event.comments;
    comments.push(comment);
    var uiFormattedComments = formatComments(comments);
    createContentBoxes(uiFormattedComments,$("#comments"));

    $('textarea#commentTextArea').val("");
}

function formatComments(comments) {
    var formattedComments = [];
    $.each( comments, function( index, comment ){
        var h = comment.author + " commented at " + convertTime(comment.post_date) + " on " + convertDate(comment.post_date);

        var c = {head: h,
            body:comment.content,
            eventId:""};
            formattedComments.push(c);
        });
    return formattedComments;
}

