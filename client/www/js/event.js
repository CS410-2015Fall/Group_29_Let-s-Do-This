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
            var userId = LetsDoThis.Session.getInstance().getUserId();;
            handleRsvp(eventData,userId);
        });

        $("#commentForm").submit(function(event) {
            event.preventDefault(); // do not redirect
            postComment(eventData);
        });
    });
});

function loadEventData(e) {
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

    updateGuestListUi(event.accepts,event.invites,friendIds,event.declines);
}

function updateGuestListUi(acceptIds,inviteIds,friendIds,declineIds) {

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

    mapUsers(acceptIds,accepts);
    mapUsers(inviteIds,invites);
    mapUsers(friendIds,friends);
    mapUsers(declineIds,declines);
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
    var date = currentDate();
    var author = LetsDoThis.Session.getInstance().getUserInfo();
    var newComment = {
        author: author,
        post_date: date,
        content: $('textarea#commentTextArea').val()
    };

    // send comment to server
    // addComment(event.event_id,
    //     author,
    //     date,
    //     newComment.content);

    // update UI
    var comments = event.comments; // if we get comments from the server here we will update with any other comments posted since we last reloaded from it
    comments.push(newComment);
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

function handleRsvp(e,userId) {
    e.invites = jQuery.grep(e.invites, function(value) {
      return value != userId;
  });
        e.declines = jQuery.grep(e.declines, function(value) {
      return value != userId;
  });

    e.accepts.push(userId);
    updateGuestListUi(e.accepts,e.invites,[],e.declines);


    $("#rsvpButton").attr('disabled', 'true');
    $("#rsvpPopup").popup( "open" )

}
