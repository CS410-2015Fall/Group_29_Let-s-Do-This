// Calls to the server related to Event ShoppingList
// There is one ShoppingList per event
// A ShoppingList is automatically created upon event creation
// ready is a Boolean (true, false)
// supplier is user ID


function getShoppingList(eventId, callback) {
    // returns the event's shopping list (list of item objects)
    // each item can have: item_id, display_name, quantity, cost, supplier, ready
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
	var shoppingListUrl = "http://159.203.12.88/api/events/"+eventId+"/shoppinglist/";

	$.ajax({
		type: 'GET',
		url: shoppingListUrl,
		dataType: 'json',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		success: function (resp) {
			console.log("Received Shopping List");
			callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});
}


function addShoppingListItem(eventId, display_name, quantity, cost, supplier, ready) {
    // adds items to existing shopping list
    // eventId, display_name are mandatory
    
	var shoppingListUrl = "http://159.203.12.88/api/events/"+eventId+"/shoppinglist/";
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
    
	var postData = {
		"display_name": name,
		"quantity": quantity,
		"cost": cost,
		"supplier" : supplier,
		"ready" : ready
	};

	$.ajax({
		type: 'POST',
		url: shoppingListUrl,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		data: JSON.stringify(postData), 
		contentType: 'application/json',
		dataType: 'json',
		success: function () {
			console.log("Item added");
		},
		error: function(e) {
            console.log(e);
		}
	});
}

function editShoppingList(eventId, display_name, quantity, cost, supplier, ready) {
    // edits existing shopping list items
    // eventId, display_name are mandatory
	
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
	
    // TODO: test!
	var putData = {
		"display_name": display_name,
        "quantity": quantity,
        "cost": cost,
        "supplier": supplier,
        "ready": ready
	}
	
	var shoppingListUrl = "http://159.203.12.88/api/events/"+eventId+"/shoppinglist/edit";
	
	$.ajax({
		type: 'PUT',
		url: shoppingListUrl,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		data: JSON.stringify(putData),
		contentType: 'application/json',
		dataType: 'json',
		success: function (resp) {
			console.log("Shopping list edited");
			callback();
		},
		error: function(e) {
			console.log(e);
		}
	});
}

function removeShoppingList(eventId, itemId) {
    // POST
    // eventId, itemId are mandatory
    var shoppingListUrl = "http://159.203.12.88/api/events/"+eventId+"/shoppinglist/remove/";
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
    
	var postData = {
		"item_id": itemId
	};

	$.ajax({
		type: 'POST',
		url: shoppingListUrl,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		data: JSON.stringify(postData), 
		contentType: 'application/json',
		dataType: 'json',
		success: function () {
			console.log("");
		},
		error: function(e) {
            console.log(e);
		}
	});
}

function getShoppingListItem(eventId, itemId) {
    // GET
    // needs event ID and item ID in url key
    // returns specified item
    var authToken = LetsDoThis.Session.getInstance().getAuthToken();
	var shoppingListUrl = "http://159.203.12.88/api/events/"+eventId+"/shoppinglist/"+itemId+"/";

	$.ajax({
		type: 'GET',
		url: shoppingListUrl,
		dataType: 'json',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		success: function (resp) {
			console.log("Received item from shopping list");
			callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});
}

function editShoppingListItem(eventId, itemId, display_name, quantity, cost, supplier, ready) {
    // edits an item in the event shopping list
    // eventId, itemId, display_name are mandatory
    var authToken = LetsDoThis.Session.getInstance().getAuthToken();
	var shoppingListUrl = "http://159.203.12.88/api/events/"+eventId+"/shoppinglist/"+itemId+"/";    
    
    // TODO: test!
	var putData = {
		"display_name": display_name,
        "quantity": quantity,
        "cost": cost,
        "supplier": supplier,
        "ready": ready
	}
	
	var shoppingListUrl = "http://159.203.12.88/api/events/"+eventId+"/shoppinglist/"+itemId+"/";
	
	$.ajax({
		type: 'PUT',
		url: shoppingListUrl,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		data: JSON.stringify(putData),
		contentType: 'application/json',
		dataType: 'json',
		success: function (resp) {
			console.log("item edited");
			callback();
		},
		error: function(e) {
			console.log(e);
		}
	});
}

function deleteShoppingListItem(eventId, itemId) {
    // DELETE
    // needs event id, item id in url key
    var authToken = LetsDoThis.Session.getInstance().getAuthToken();

    var shoppingListUrl = "http://159.203.12.88/api/events/"+eventId+"/shoppinglist/"+itemId+"/";
    
	$.ajax({
		type: 'DELETE',
		url: shoppingListUrl,
		dataType: 'json',
		beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		success: function (resp) {
			console.log("Deleted item");
			callback(resp);
		},
		error: function(e) {
			console.log(e);
		}
	});
}