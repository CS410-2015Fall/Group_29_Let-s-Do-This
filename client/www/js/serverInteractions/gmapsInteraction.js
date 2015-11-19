var map; //The map object
var eventTitle;
var eventLocation;
document.addEventListener("deviceready", function(){
  //Nothing can occur with this plugin until this function completes
  console.log("Google maps received deviceready");

  // // -------Straight stole this from https://github.com/mapsplugin/cordova-plugin-googlemaps/wiki/Map---------
  // Initialize the map plugin
  map = plugin.google.maps.Map.getMap();
  // You have to wait the MAP_READY event.
  map.on(plugin.google.maps.event.MAP_READY, onMapInit);
}, false);

function onMapInit(map) {
  //The google maps utils are finally loaded

  //Display the map in the appropriate container
  var mapDiv = document.getElementById('mainContent');
  map.setDiv(mapDiv);

  console.log("Searching for a latlong at: " + eventLocation);
  //Convert the event location into a lat long
  getLatLong(eventLocation, function(latLong){
    //getLatLong is going to run async, so we must use this callback
    console.log("Result is... " + latLong);
    //And finally put the event marker on the map
    dropMarker(eventTitle, latLong);
  });
}

//Converts the location (name or address or something googlable), into a latLong
//Returns the resulting lat long
function getLatLong(location, callback){
  //The request data
  var request = {
    'address': location //Ideally location would be an address, but anything will do
  };
  console.log('request:');
  console.log(request);

  plugin.google.maps.Geocoder.geocode(request, function(results) {
    if (results.length) {//Make sure we found something
      var result = results[0];
      var position = result.position;

      callback(position); //run the callback with the lat long
    } else { //There we no results found for this location
      alert("There was a problem locating this event!");
    }
  });
}

//Places a marker on the map at the latLong with the given name
function dropMarker(title, latLong){
  map.addMarker({
    'title': title,
    'position': latLong
  }); //addMarker can also take a callback function
  map.animateCamera({
  'target': latLong,
  'zoom': 15
});
}

function initEventData(title, loc){
  console.log("setting eventLocation as: " + loc);
  eventTitle = title;
  eventLocation = loc;
}
