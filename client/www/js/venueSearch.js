$(document).ready(function() {
  console.log("Venue script loading");
  $.getScript("js/yelpScripts/yelpCalls.js");

  $("#yelpSearchForm").submit(function(event) {
    event.preventDefault(); //Prevent the sumbit button from redirecting us back to the home page
    console.log("Form sumbitted");
    //Get values from fields
    var term = $('#searchTerm').val();
    var city = $('#city').val();
    var radius = $('#radius').val();
    var sort = 0;

    if($("#distance").prop("checked")){
      sort = 1;
    } else if($("#highestRated").prop("checked")){
      sort = 2;
    }

//Make the yelp call
    searchYelp(city, radius, term, sort, function(results){
      //Search yelp runs async so we want to give it the function to run on success
      console.log("results = " + results);
      var formattedResults = parseAndPrint(results);
      console.log('formattedResults = ' + formattedResults);
      //Clear past results
      $("#results").empty();
      //And put the new ones in
      $("#results").append(formattedResults);
    });
  });
});

//This function will return the selected name and address to the createEvent page
function returnToEventCreation(name, address){
  console.log("Returning: " + name + ": " + address + "to createEvent");
  window.opener.setLocation(name, address);
  window.close();
}
