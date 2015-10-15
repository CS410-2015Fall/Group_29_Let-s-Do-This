$(document).ready(function() {
  console.log("Venue script loaded");
  $.getScript("js/yelpCalls.js");
  $("#yelpSearchForm").submit(function() {
    console.log("Form sumbitted");
    var term = $('#searchTerm').val();
    var city = $('#city').val();
    var distance = $('#distance').val();
    var sort = 0;

    if($("#distance").prop("checked")){
      sort = 1;
    } else if($("#highestRated").prop("checked")){
      sort = 2;
    }

    // //  searchYelp(city, distance, term, sortBy)
    searchYelp(city, distance, term, sort);
  });
});
