function parseAndPrint(object){
  //So oddly enough, the object is already parsed and stored in an array
  console.log('pAP sees: ' + object);
  var businesses = object.businesses; //Each individual business object


//What happens if there are no results?
  if(businesses.length==0){
  return '<p>Sorry there were no results! <a href="venueSearch.html">Return to Search</a></p>';
  }

  //We will initialize the table here, add each td and tr cell in the loop, and close the table at the end of the loop
  var tableHTML = '<table>';

  for (i=0; i < businesses.length; i++){ //Go through each business
    var name = businesses[i].name;
    var ratingImage = businesses[i].rating_img_url_small; //Yelp requires us to display their rating image
    var numReviews = businesses[i].review_count; //Yelp also requires us to display how many reviews they have
    var link = businesses[i].url;
    var address = businesses[i].location.address[0];
    var city = businesses[i].location.city;

    // console.log("i=" + i + "; Name: " + name);
    var nameCode = '<a href=' + link + '>' + name + '</a>';
    var addressCode = address + ', ' + city;
    var reviewCode = '<img src=' + ratingImage + '> ' + numReviews + ' Reviews';

    // This is a mess
    // Basically the structure is having a table with two rows (one empty used for spacing).
    // In the first row, there are two cells.
    //   The first cell contains another table which has all the details.
    //   The second cell contains a button allowing the user to select that location.
    var cells = '<tr><td>' +
    '<table><tr><td>' + nameCode + '</td></tr>' +
    '<tr><td>' + reviewCode + '</td></tr>' +
    '<tr><td>' + addressCode + '</td></tr>' +
    '</td></table><td>' +
    '<button onclick=\"returnToEventCreation(\'' + name + '\', \'' + address + '\');\">Select ' + name + '!</button>' + //This will allow us to fill the location field in on the event creation page
    '</td></tr>' +
    '<tr><td><br></td></tr>'; //Empty row to make it a bit nicer
    tableHTML = tableHTML.concat(cells);
  }
  tableHTML = tableHTML.concat('</table>');
  return tableHTML;
}
