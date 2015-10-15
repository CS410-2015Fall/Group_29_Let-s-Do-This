$(document).ready(function() {
  console.log("Venue script loaded");
  $.getScript("js/yelpCalls.js");
  $("#yelpSearchForm").submit(function() {
    console.log("Form sumbitted");
    var term = $('#searchTerm').val();
    var city = $('#city').val();

    // //  searchYelp(city, distance, term, sortBy)
    searchYelp(city, null, term, null);
  });
});
