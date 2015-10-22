// This function requires the following formats
// start: YYYY-MM-DDThh:mm
// end: YYYY-MM-DDThh:mm
function sendToServer(name, start, end, budget, location){
	console.log('Prepping to create event on server');
	var host = ['1']; //Hosts has to be a list
	var postData = {
		"display_name": name,
		"start_date": start,
		"end_date": end,
		"hosts" : host,
		"budget" : budget,
		"location" : location,
	};

	$.ajax({
		type: 'POST',
		url: "http://159.203.12.88/api/events/",

		data: JSON.stringify(postData), //stringify makes the post data all nice and jsony
		contentType: 'application/json',
		dataType: 'json',
		success: function (resp) {
			console.log("Created event");
		},
		error: function(e) {
			console.log("Failed to create event: ");
			console.log(e.message);
		}
	});
}
