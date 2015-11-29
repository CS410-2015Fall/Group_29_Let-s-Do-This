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


function addShoppingListItem(eventId, display_name, quantity, cost, supplier, ready, callback) {
    // adds items to existing shopping list
    // eventId, display_name are mandatory
    // submit list of items

	var shoppingListUrl = "http://159.203.12.88/api/events/"+eventId+"/shoppinglist/";
	var authToken = LetsDoThis.Session.getInstance().getAuthToken();

	var postData = [{
		"display_name": display_name,
		"quantity": quantity,
		"cost": cost,
		"supplier" : supplier,
		"ready" : ready
	}];

	$.ajax({
		type: 'POST',
		url: shoppingListUrl,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "JWT " + authToken);
		},
		data: JSON.stringify(postData),
		contentType: 'application/json',
		dataType: 'json',
		success: function (resp) {
			console.log("Item added");
			callback(resp);
		},
		error: function(e) {
            console.log(e);
		}
	});
}

// This doesn't seem to be used anywhere... let's comment it out and see if anything breaks! :D
//function editShoppingList(eventId, display_name, quantity, cost, supplier, ready) {
//    // edits existing shopping list items
//    // eventId, display_name are mandatory
//    // can edit multiple items at once
//	
//	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
//	
//    // TODO: test!
//	var putData = {
//		"display_name": display_name,
//        "quantity": quantity,
//        "cost": cost,
//        "supplier": supplier,
//        "ready": ready
//	}
//	
//	var shoppingListUrl = "http://159.203.12.88/api/events/"+eventId+"/shoppinglist/edit";
//	
//	$.ajax({
//		type: 'PUT',
//		url: shoppingListUrl,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "JWT " + authToken);
//		},
//		data: JSON.stringify(putData),
//		contentType: 'application/json',
//		dataType: 'json',
//		success: function (resp) {
//			console.log("Shopping list edited");
//			callback();
//		},
//		error: function(e) {
//			console.log(e);
//		}
//	});
//}

// This also appears to be unused!
//function removeShoppingList(eventId, itemId) {
//    // POST
//    // eventId, itemId are mandatory
//    // deletes shopping list item(s) from list
//    var shoppingListUrl = "http://159.203.12.88/api/events/"+eventId+"/shoppinglist/remove/";
//	var authToken = LetsDoThis.Session.getInstance().getAuthToken();
//    
//	var postData = {
//		"item_id": itemId
//	};
//
//	$.ajax({
//		type: 'POST',
//		url: shoppingListUrl,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "JWT " + authToken);
//		},
//		data: JSON.stringify(postData), 
//		contentType: 'application/json',
//		dataType: 'json',
//		success: function () {
//			console.log("");
//		},
//		error: function(e) {
//            console.log(e);
//		}
//	});
//}

// Another unused function! :O
//function getShoppingListItem(eventId, itemId) {
//    // GET
//    // needs event ID and item ID in url key
//    // returns specified item
//    var authToken = LetsDoThis.Session.getInstance().getAuthToken();
//	var shoppingListUrl = "http://159.203.12.88/api/events/"+eventId+"/shoppinglist/"+itemId+"/";
//
//	$.ajax({
//		type: 'GET',
//		url: shoppingListUrl,
//		dataType: 'json',
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "JWT " + authToken);
//		},
//		success: function (resp) {
//			console.log("Received item from shopping list");
//			callback(resp);
//		},
//		error: function(e) {
//			console.log(e);
//		}
//	});
//}

function editShoppingListItem(eventId, itemId, display_name, quantity, cost, supplier, ready, callback) {
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

// Yup... this isn't being used
//function deleteShoppingListItem(eventId, itemId) {
//    // DELETE
//    // needs event id, item id in url key
//    var authToken = LetsDoThis.Session.getInstance().getAuthToken();
//
//    var shoppingListUrl = "http://159.203.12.88/api/events/"+eventId+"/shoppinglist/"+itemId+"/";
//    
//	$.ajax({
//		type: 'DELETE',
//		url: shoppingListUrl,
//		dataType: 'json',
//		beforeSend: function(xhr) {
//				xhr.setRequestHeader("Authorization", "JWT " + authToken);
//		},
//		success: function (resp) {
//			console.log("Deleted item");
//			callback(resp);
//		},
//		error: function(e) {
//			console.log(e);
//		}
//	});
//}