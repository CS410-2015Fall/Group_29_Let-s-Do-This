$.getScript("js/global.js", function() {
    $(document).ready(function() {
        var eventData = JSON.parse( localStorage.getItem("eventObj") );
        console.log(eventData);
        loadEventData(eventData);

        $("#inviteButton").click(function(){
            var invited = getGuestCheckboxValues();
            // TODO set changed users to invited/uninvited
            // do not call function if no users were invited
            if (invited.length != 0) {
                inviteFriends(eventData,invited);
            };
            $("#friendsPopup").popup("close");
        });

        $("#homeButton").click(function(){
            window.location="home.html";
        });

        $("#rsvpButton").click(function(){
            var userInfo = LetsDoThis.Session.getInstance().getUserInfo();;
            handleRsvp(eventData,userInfo);
        });

        $("#commentForm").submit(function(event) {
            event.preventDefault(); // do not redirect
            postComment(eventData);
        });
    });
});

function loadEventData(e) {
  // console.log("loading event");
  // console.log(e);
  $("#eventName").html("<strong>" + e.display_name + "</strong>");

  var dateString = convertDate(e.start_date,e.end_date);

  $("#dateTime").html(dateString);
  $("#location").html("Location: " + e.location);

  loadGuests(e);

  var userId = LetsDoThis.Session.getInstance().getUserId();
  if ($.inArray(userId,e.accepts) == 0) {
    $("#rsvpButton").attr('disabled', 'true');
}

var comments = formatComments(e.comments);
createContentBoxes(comments,$("#comments"));
}

function loadGuests(event) {
    
    var friendIds = LetsDoThis.Session.getInstance().getUserFriends();
    
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

    updateGuestListUi(event.accepts,event.invites,friendIds,event.declines);
}

function updateGuestListUi(accepts,invites,friends,declines) {

    //var accepts = [];
    //var invites = [];
    //var friends = [];
    //var declines = [];

    // get user information corresponding to the userIds
    //function mapUsers(userIds, users) {
    //    jQuery.map(userIds, function(val,key){
    //        getUser(val, function(resp) {
    //            var u = {
    //                username:resp.username,
    //                user_id:val
    //            }
    //            users.push(u);
    //        });
    //    });
    //}

    //mapUsers(acceptIds,accepts);
    //mapUsers(inviteIds,invites);
    //mapUsers(friendIds,friends);
    //mapUsers(declineIds,declines);
    //create html for list of users associated with event
    function write(list, attrs, status) {
        var str = "";
        $.each(list, function(i, user) {
            str += '<input type="checkbox" name="accept" id="' + user.id + '" value="' + user.id + '" ' + attrs + '><label for="' + user.id + '">' + user.username + ' ' + status + '</label>';
        });
        return str;
    }

    var s = "";
    s += write(accepts, ' checked="true" disabled="true"', '(attending)');
    s += write(invites, ' checked="true"', '(invited)');
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
    var date = currentDate();
    var author = LetsDoThis.Session.getInstance().getUserInfo();
    var newComment = {
        author: author,
        post_date: date,
        content: $('textarea#commentTextArea').val()
    };

    // update UI
    getAllComments(event.id, function(resp) {
        resp.push(newComment);
        var uiFormattedComments = formatComments(resp);
        createContentBoxes(uiFormattedComments,$("#comments"));
        $('textarea#commentTextArea').val("");
    });
    // var comments = event.comments; // if we get comments from the server here we will update with any other comments posted since we last reloaded from it
    // comments.push(newComment);

    // send comment to server
    addComment(event.id,
        LetsDoThis.Session.getInstance().getUserId(),
        date,
        newComment.content);
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

function handleRsvp(e,userInfo) {
    e.invites = jQuery.grep(e.invites, function(value) {
        return value != userInfo;
    });
    e.declines = jQuery.grep(e.declines, function(value) {
        return value != userInfo;
    });

    rsvpToEvent(e.id,'accepts', function(){
        // do something
    });

    e.accepts.push(userInfo);
    updateGuestListUi(e.accepts,e.invites,[],e.declines);

    $("#rsvpButton").attr('disabled', 'true');
    $("#rsvpPopup").popup( "open" )

}

function inviteFriends(e,invitedUsers) {
    inviteToEvent(e.id, invitedUsers, function(){
        // on success, update event information
        // there is probably a simpler way to do this
        getEvent(e.id,function(updatedEvent){
            localStorage.setItem("eventObj", JSON.stringify(updatedEvent));
            eventData = JSON.parse( localStorage.getItem("eventObj") );
            loadGuests(eventData);
        });

    });
}