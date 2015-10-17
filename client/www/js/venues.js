$(document).ready(function() {
  console.log("Venue script loading");
  $.getScript("js/yelpScripts/yelpCalls.js");

  $("#yelpSearchForm").submit(function(event) {
    event.preventDefault(); //Prevent the sumbit button from redirecting us back to the home page
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
    searchYelp(city, distance, term, sort, function(results){
      //Search yelp runs async so we want to give it the function to run on success
      // console.log("results = " + results);
      var formattedResults = parseAndPrint(results);
      // console.log('formattedResults = ' + formattedResults);
      $("#mainContent").append(formattedResults);
    });

  });
});
