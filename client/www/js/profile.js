$(document).ready(function() {
  console.log('Profile script loading');
  $("#yelpPage").click(function(){ //Remove when yelp page set up
    console.log('Going to Yelp Page');
    $("#mainContent").load("venues.html");
  });
});
