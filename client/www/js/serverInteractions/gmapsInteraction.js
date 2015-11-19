var map; //The map object

$(document).ready(function() {

});

document.addEventListener("deviceready", function(){
  console.log("Google maps received deviceready");
  //
  // // -------Straight stole this from https://github.com/mapsplugin/cordova-plugin-googlemaps/wiki/Map---------
  // Initialize the map plugin
  map = plugin.google.maps.Map.getMap();
  // You have to wait the MAP_READY event.
  map.on(plugin.google.maps.event.MAP_READY, onMapInit);
}, false);

function onMapInit(map) {
  var mapDiv = document.getElementById('mainContent');
	map.setDiv(mapDiv);
}
