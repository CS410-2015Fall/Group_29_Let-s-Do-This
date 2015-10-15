$(document).ready(function() {
  $.getScript("js/yelpCalls.js");
  $("#yelpCall").click(function(){
    console.log("Calling yelp api");
    callYelp();
    console.log("Finished calling yelp api");
  });
});
