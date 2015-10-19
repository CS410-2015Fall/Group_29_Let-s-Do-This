var LetsDoThis = LetsDoThis || {};

$(document).on("pagecreate", "#page-home", function(event) {
    
    var userData = LetsDoThis.Session.getInstance().get();
    
    $("#page-home").append("<p>Let's Do This, "+userData.username+"!</p>");
});  