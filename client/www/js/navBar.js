$(document).ready(function() {
  $("#homeButton").click(function(){
    $("#mainContent").load("home.html");
  });
  $("#profileButton").click(function(){
    $("#mainContent").load("profile.html");
  });
  $("#createButton").click(function(){
    $("#mainContent").load("createEvent.html");
  });
  $("#eventButton").click(function(){
    $("#mainContent").load("events.html");
  });
  console.log('Navbar ready to go');
});
