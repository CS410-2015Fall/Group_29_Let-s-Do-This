$.getScript("js/global.js", function() {
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
        var author = LetsDoThis.Session.getInstance().getUserInfo();
        var newComment = {
            author: author,
            post_date: currentDateTime,
            content: $('textarea#commentTextArea').val()
        };
        postComment(eventData,newComment);
    });
    });
});

function loadEventData(e) {
    $("#eventName").html("<strong>" + e.display_name + "</strong>");

    var dateString = convertDate(e.start_date);//,e.end_date);

$("#dateTime").html(dateString);
$("#location").html("Location: " + e.location);

loadGuests(e);

    // TODO
    // if (you yourself are already marked as attending) {
        // LetsDoThis.Session.getInstance().getUserId();
        // $("#rsvpButton").attr('disabled', 'true');
    // }

    var comments = formatComments(e.comments);
    createContentBoxes(comments,$("#comments"));
}

function loadGuests(event) {
    var friendIds = [];//LetsDoThis.Session.getInstance().getUserFriends();

    // reduce friendIds so that it contains only those ids which are not already invited, attending or declining the event
    function reduceList(l1,l2) {
        $.each(l2, function(index, val) {
            l1 = jQuery.grep(l1, function(value) {
                return value != val;
            });
        });
        return l1;
    }

    friendIds = reduceList(friendIds,event.invites);
    friendIds = reduceList(friendIds,event.accepts);
    friendIds = reduceList(friendIds,event.declines);

    var accepts = [];
    var invites = [];
    var friends = [];
    var declines = [];

    // get user information corresponding to the userIds
    function mapUsers(userIds, users) {
        jQuery.map(userIds, function(val,key){
            getUser(val, function(resp) {
                var u = {
                    username:resp.username,
                    user_id:val
                }
                users.push(u);
            });
        });
    }
    mapUsers(event.accepts,accepts);
    mapUsers(event.invites,invites);
    mapUsers(friendIds,friends);
    mapUsers(event.declines,declines);

    // var invites = jQuery.map(event.invites, function(val,key){ return getUserById(val);});
    // var friends = jQuery.map(friendIds, function(val,key){return getUserById(val);});
    // var declines = jQuery.map(event.declines, function(val,key){return getUserById(val);});

// TEMP FAKE DATA
// friends = [{user:"mario",friends:[],email:"",phone:0,user_id: 6354},{user:"luigi",friends:[],email:"",phone:0,user_id: 9448},{user:"toad",friends:[],email:"",phone:0,user_id: 0987}];
// invites = [{user:"oprah!",friends:[],email:"",phone:0,user_id: 5432},{user:"siddhartha",friends:[],email:"",phone:0,user_id: 5132}];
// accepts = [{user:"kali fornia",friends:[],email:"",phone:0,user_id: 1321},{user:"billy lee",friends:[],email:"",phone:0,user_id: 1233}];
// declines = [{user:"bowser",friends:[],email:"",phone:0,user_id: 12533}];
updateGuestListUi(accepts,invites,friends,declines);
}

function updateGuestListUi(accepts,invites,friends,declines) {
    //create html for list of users associated with event
    function write(list, attrs, status) {
        var str = "";
        $.each(list, function(i, user) {
            str += '<input type="checkbox" name="accept" id="' + user.user_id + '" value="' + user.user_id + '" ' + attrs + '><label for="' + user.user_id + '">' + user.username + ' ' + status + '</label>';
        });
        return str;
    }

    var s = "";
    s += write(accepts, ' checked="true" disabled="true"', '(attending)');
    s += write(invites, ' checked="true"', '');
    s += write(friends, '', '');
    s += write(declines, ' disabled="true"', '(not attending)');
    $("fieldset#friendsPopup").html(s);
    $("#friendsPopup").trigger('create');
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
        var h = comment.author.username + " commented at " + convertDate(comment.post_date);

        var c = {head: h,
            body:comment.content,
            boxId:""};
            formattedComments.push(c);
        });
    return formattedComments;
}

