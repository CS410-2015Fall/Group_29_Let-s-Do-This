//We need to load the page scripts here, as loading them in the page produces a deprecated warning
var profileJSURL = "js/profile.js";

$(document).ready(function() {
  console.log('Navbar ready to go');
  $("#homeButton").click(function(){
    $("#mainContent").load("home.html");
  });
  $("#profileButton").click(function(){
    $("#mainContent").load("profile.html");
    $.getScript(profileJSURL);
  });
  $("#createButton").click(function(){
    $("#mainContent").load("createEvent.html");
  });
  $("#eventButton").click(function(){
    $("#mainContent").load("events.html");
  });
});
