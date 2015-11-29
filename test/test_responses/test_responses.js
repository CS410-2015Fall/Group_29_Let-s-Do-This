// Mock responses from server, for testing purposes


// Storing some response text in variables for easy reuse

var mockToken = '"yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNoYXliZWF1IiwidXNlcl9pZCI6NiwiZW1haWwiOiIiLCJleHAiOjE0NDg1NjI4NDF9.fqBQIh9p6V8LUWr9e6X25ISzwR87PD3wDHqsgP6XgFM"';
var serverUrl = 'http://159.203.12.88';

var beachBBQPoll = '{"id": 1, "question": "What is love?", "event": 42, "poll_choices": [{"id": 3, "poll": 1, "choice_text": "No more", "votes": 1}, {"id": 2, "poll": 1, "choice_text": "Dont hurt me", "votes": 0}, {"id": 1, "poll": 1, "choice_text": "Baby dont hurt me", "votes": 0}]}';
var beachBBQPolls = '['+beachBBQPoll+']';
var beachBBQItemGrill = '{"id": 3, "display_name": "portable grill", "quantity": "1.00", "cost": "50.00", "supplier": {"id": 6, "username": "shaybeau"}, "ready": true}';
var beachBBQShoppingList = '{"id": 1, "items": [{"id": 2, "display_name": "rain coats", "quantity": "4.00", "cost": "200.00", "supplier": {"id": 1, "username": "mcgrandlej"}, "ready": false}, {"id": 4, "display_name": "hot dogs", "quantity": null, "cost": null, "supplier": null, "ready": null}, {"id": 1, "display_name": "hot dogs", "quantity": "1.00", "cost": "6.66", "supplier": {"id": 7, "username": "graham"}, "ready": true}], "event": 42}';
var beachBBQShoppingListWithGrill = '{"id": 1, "items": [{"id": 2, "display_name": "rain coats", "quantity": "4.00", "cost": "200.00", "supplier": {"id": 1, "username": "mcgrandlej"}, "ready": false}, {"id": 4, "display_name": "hot dogs", "quantity": null, "cost": null, "supplier": null, "ready": null}, {"id": 1, "display_name": "hot dogs", "quantity": "1.00", "cost": "6.66", "supplier": {"id": 7, "username": "graham"}, "ready": true}, '+beachBBQItemGrill+'], "event": 42}';
var beachBBQContributions = '[{"username": "mcgrandlej", "items": [{"ready": false, "cost": "200.00", "display_name": "rain coats", "id": 2, "quantity": "4.00"}], "total": "200.0", "id": 1}, {"username": "shaybeau", "items": [{"ready": true, "cost": "50.00", "display_name": "portable grill", "id": 3, "quantity": "1.00"}], "total": "50.0", "id": 6}, {"username": "graham", "items": [{"ready": true, "cost": "6.66", "display_name": "hot dogs", "id": 1, "quantity": "1.00"}], "total": "6.66", "id": 7}]';
var beachBBQEvent = '{"id": 42, "display_name": "BBQ on the beach (dress warmly!)", "start_date": "2015-11-14T12:00:00Z", "end_date": "2015-11-14T17:00:00Z", "budget": "200.00", "location": "Spanish Banks", "hosts": [2], "invites": [7], "accepts": [6], "declines": [], "changed": [2,6], "comments": [], "shopping_list": '+beachBBQShoppingList+', "contributions": '+beachBBQContributions+', "event_polls": '+beachBBQPolls+', "cancelled": false}';

var starbucksComment = '{"id": 25, "author": {"id": 6, "username": "shaybeau"}, "post_date": "2015-11-23T00:38:48.115000Z", "content": "Red cups!", "event": [46]}';
var starbucksComments = '['+starbucksComment+']';
var starbucksItemPeppermintMocha = '{"id": 39, "display_name": "Tall Peppermint Mocha", "quantity": "1.00", "cost": "4.50", "supplier": {"id": 6, "username": "shaybeau"}, "ready": false}';
var starbucksItemEggnogLatte = '{"id": 40, "display_name": "Grande Chai Eggnog Latte", "quantity": "1.00", "cost": "5.00", "supplier": {"id": 6, "username": "shaybeau"}, "ready": true}';
var starbucksEvent = '{"id": 46, "display_name": "Starbucks Run", "start_date": "2015-11-25T11:01:00Z", "end_date": "2015-11-26T01:22:00Z", "budget": null, "location": "Starbucks: 4011 Bayview St", "hosts": [6], "invites": [8,10,11,13], "accepts": [], "declines": [], "changed": [], "comments": '+starbucksComments+', "shopping_list": {"id": 4, "items": ['+starbucksItemPeppermintMocha+', '+starbucksItemEggnogLatte+'], "event": 46}, "contributions": [{"username": "shaybeau", "items": [{"ready": false, "cost": "4.50", "display_name": "Tall Peppermint Mocha", "id": 39, "quantity": "1.00"}, {"ready": true, "cost": "5.00", "display_name": "Grande Chai Eggnog Latte", "id": 40, "quantity": "1.00"}], "total": "9.5", "id": 6}], "event_polls": [], "cancelled": null}';

var newEventName = 'Event';
var newEventEditedName = 'My Event';
var newEventNoUser = '';
var newEventUserId = '6';
var newEventHost = '1';

var newEvent = '{"id": 48, "display_name": "'+newEventName+'", "start_date": "2015-11-26T23:54:00Z", "end_date": "2015-11-27T00:54:00Z", "budget": null, "location": "Pizza Garden: 5780 University Boulevard, Vancouver", "hosts": ['+newEventHost+'], "invites": ['+newEventNoUser+'], "accepts": ['+newEventNoUser+'], "declines": ['+newEventNoUser+'], "changed": ['+newEventNoUser+'], "comments": [], "shopping_list": {"id": 6, "items": [], "event": 48}, "contributions": [], "event_polls": [], "cancelled": null}';
var newEventInvited = '{"id": 48, "display_name": "'+newEventEditedName+'", "start_date": "2015-11-26T23:54:00Z", "end_date": "2015-11-27T00:54:00Z", "budget": null, "location": "Pizza Garden: 5780 University Boulevard, Vancouver", "hosts": ['+newEventHost+'], "invites": ['+newEventNoUser+'], "accepts": ['+newEventNoUser+'], "declines": ['+newEventNoUser+'], "changed": ['+newEventNoUser+'], "comments": [], "shopping_list": {"id": 6, "items": [], "event": 48}, "contributions": [], "event_polls": [], "cancelled": null}';
var newEventAccepted = '{"id": 48, "display_name": "'+newEventEditedName+'", "start_date": "2015-11-26T23:54:00Z", "end_date": "2015-11-27T00:54:00Z", "budget": null, "location": "Pizza Garden: 5780 University Boulevard, Vancouver", "hosts": ['+newEventHost+'], "invites": ['+newEventNoUser+'], "accepts": ['+newEventUserId+'], "declines": ['+newEventNoUser+'], "changed": ['+newEventNoUser+'], "comments": [], "shopping_list": {"id": 6, "items": [], "event": 48}, "contributions": [], "event_polls": [], "cancelled": null}';
var newEventDeclined = '{"id": 48, "display_name": "'+newEventEditedName+'", "start_date": "2015-11-26T23:54:00Z", "end_date": "2015-11-27T00:54:00Z", "budget": null, "location": "Pizza Garden: 5780 University Boulevard, Vancouver", "hosts": ['+newEventHost+'], "invites": ['+newEventNoUser+'], "accepts": ['+newEventNoUser+'], "declines": ['+newEventUserId+'], "changed": ['+newEventNoUser+'], "comments": [], "shopping_list": {"id": 6, "items": [], "event": 48}, "contributions": [], "event_polls": [], "cancelled": null}';
var newEventEdited = '{"id": 48, "display_name": "'+newEventEditedName+'", "start_date": "2015-11-26T23:54:00Z", "end_date": "2015-11-27T00:54:00Z", "budget": null, "location": "Pizza Garden: 5780 University Boulevard, Vancouver", "hosts": ['+newEventHost+'], "invites": ['+newEventNoUser+'], "accepts": ['+newEventUserId+'], "declines": ['+newEventNoUser+'], "changed": ['+newEventHost+', '+newEventUserId+'], "comments": [], "shopping_list": {"id": 6, "items": [], "event": 48}, "contributions": [], "event_polls": [], "cancelled": null}'; 



// The test responses!

var testResponses = {
    
    testTestResponse: {
        success: {
            status: 200,
            responseText: '{}'
        },
        error: {
            status: 401
        }
    },
    
    // *************************************
    // User Related Test Responses
    // *************************************
    
    // Create User
    // POST
    // /api/users/new/
    createUserStampy: {
        success: {
            status: 200,
            responseText: '{"username": "Stampy", "password": "", "email": "bawoo@test.com", "phone": "6045555555", "friends": []}'
        },
        error: {
            status: 400
        }
    },
    
    // Login User
    // POST
    // /login/
    logInStampy: {
        success: {
            status: 200,
            responseText: '{"token": '+mockToken+'}'
        },
        error: {
            status: 400
        }
    },
    
    // Get User Id
    // POST
    // /api/users/search/
    userIdStampy: {
        success: {
            status: 200,
            responseText: '{"id": 123}'
        },
        error: {
            status: 401
        }
    },
    
    // Get User Info (during login)
    // GET
    // /api/users/<user id>/
    userInfoStampy: {
        success: {
            status: 200,
            responseText: '{"username": "Stampy", "email": "bawoo@test.com", "phone": "6045555555", "friends": []}'
        },
        error: {
            status: 401
        }
    },
    
    // Get User (otherwise)
    // GET
    // /api/users/<user id>/
    userInfoMrPeanutbutter: {
        success: {
            status: 200,
            responseText: '{"username": "MrPeanutbutter", "phone": "6041234567", "friends": [{"id":21, "username":"cat", "email": "", "phone": ""}, {"username": "shaybeau", "phone": "6047654324", "id": 6, "email": "shayshay@email.com"}], "id": 20, "email": "peanutbutter@isoneword.com"}'
        },
        error: {
            status: 401
        }
    },
    
    // Get All Users
    // GET
    // /api/users/
    allUsers: {
        success: {
            status: 200,
            responseText: '[{"username": "MrPeanutbutter", "phone": "6041234567", "friends": [{"username": "cat","phone": "","id": 21,"email": ""}], "id": 20, "email": "peanutbutter@isoneword.com"}, {"username": "cat", "phone": "", "friends": [{"username": "MrPeanutbutter", "phone": "6041234567", "id": 20, "email": "peanutbutter@isoneword.com"}], "id": 21, "email": ""}, {"username": "CMBurns", "phone": "5558675309", "friends": [], "id": 18, "email": ""}]'
        },
        error: {
            status: 401
        }
    },
    
    // Update User Info (phone number)
    // PUT
    // /api/users/<user id>
    updateMrPeanutbutterPhone: {
        success: {
            status: 200,
            responseText: '{"username": "MrPeanutbutter", "phone": "6047654321", "email": "peanutbutter@isoneword.com", "friends": [{"id":21, "username":"cat", "email": "", "phone": ""}]}'
        },
        error: {
            status: 401
        }
    },
    
    // Add Friend
    // PUT
    // /api/users/<user id>/
    addShaybeauAsFriend: {
        success: {
            status: 200,
            responseText: '{"username": "MrPeanutbutter", "phone": "6047654321", "email": "peanutbutter@isoneword.com", "friends": [{"id":21, "username":"cat", "email": "", "phone": ""}, {"username": "shaybeau", "phone": "6047654324", "id": 6, "email": "shayshay@email.com"}]}'
        },
        error: {
            status: 401
        }
    },
    
    // Remove Friend
    // POST
    // /api/users/<user id>/friends/remove/
    removeShaybeauAsFriend: {
        success: {
            status: 200,
            responseText: '{"username": "MrPeanutbutter", "phone": "6047654321", "email": "peanutbutter@isoneword.com", "friends": [{"id":21, "username":"cat", "email": "", "phone": ""}]}'
        },
        error: {
            status: 401
        }
    },
    
    // Delete Friend
    // DELETE
    // /api/users/<user id>/
    deleteMrPeanutbutter: {
        success: {
            status: 200,
            responseText: '{}'
            // is there any response text?
        },
        error: {
            status: 401
        }
    },
    
    
    // *************************************
    // Event Related Test Responses
    // *************************************
    
    // Get All Events
    // GET
    // /api/events/
    getAllEvents: {
        success: {
            status: 200,
            responseText: "["+beachBBQEvent+", "+starbucksEvent+"]"
        },
        error: {
            status: 401
        }
    },
    
    // Get Changed Events
    // GET
    // /api/events/
    getChangedEvents: {
        success: {
            status: 200,
            responseText: "["+beachBBQEvent+"]"
        },
        error: {
            status: 401
        }
    },
    
    // Get Event
    // GET
    // /api/events/<event id>/
    getEvent: {
        success: {
            status: 200,
            responseText: starbucksEvent
        },
        error: {
            status: 401
        }
    },
    
    // Create Event
    // POST
    // /api/events/
    createEvent: {
        success: {
            status: 200,
            responseText: newEvent
        },
        error: {
            status: 401
        }
    },
    
    // Edit Event
    // PUT
    // /api/events/<event id>/
    editEvent: {
        success: {
            status: 200,
            responseText: newEventEdited
        },
        error: {
            status: 401
        }
    },
    
    // Invite To Event
    // PUT
    // /api/events/<event id>/
    inviteToEvent: {
        success: {
            status: 200,
            responseText: newEventInvited
            // is there any response text?
        },
        error: {
            status: 401
        }
    },
    
    // Uninvite To Event
    // POST
    // /api/events/<event id>/invites/remove/
    uninviteToEvent: {
        success: {
            status: 200,
            responseText: newEventEdited
        },
        error: {
            status: 401
        }
    },
    
    // RSVP To Event (accepts)
    // PUT
    // /api/events/<event id>/
    rsvpToEventAccept: {
        success: {
            status: 200,
            responseText: newEventAccepted
        },
        error: {
            status: 401
        }
    },
    
    // RSVP To Event (declines)
    // PUT
    // /api/events/<event id>/
    rsvpToEventDecline: {
        success: {
            status: 200,
            responseText: newEventDeclined
        },
        error: {
            status: 401
        }
    },
    
    // Cancel Event
    // POST
    // /api/events/<event id>/cancel/
    cancelEvent: {
        success: {
            status: 200,
            responseText: '{}'
            // is there any response text?
        },
        error: {
            status: 401
        }
    },
    
    // Remove from Changed
    // POST
    // /api/events/<event id>/changed/remove/
    removeFromChangedEvent: {
        success: {
            status: 200,
            responseText: '{}'
            // is there any response text?
        },
        error: {
            status: 401
        }
    },
    
    // Remove Host 
    // POST
    // /api/events/<event id>/hosts/remove/
    removeHost: {
        success: {
            status: 200
            // is there any response text?
        },
        error: {
            status: 401
        }
    },
    
    // Delete Event
    // DELETE
    // /api/events/<event id>/
    deleteEvent: {
        success: {
            status: 200
            // is there any response text?
        },
        error: {
            status: 401
        }
    },
    
    
    // *************************************
    // Event Comments Test Responses
    // *************************************
    
    // Add Comment
    // POST
    // /api/events/<event id>/comments/
    commentOnEvent: {
        success: {
            status: 200,
            responseText: starbucksComment
        },
        error: {
            status: 401
        }
    },
    
    // Get All Comments
    // GET
    // /api/events/<event id>/comments/
    getEventComments: {
        success: {
            status: 200,
            responseText: starbucksComments
        },
        error: {
            status: 401
        }
    },
    
    // Get Comment
    // GET
    // /api/events/<event id>/comments/<comment id>/
    getEventComment: {
        success: {
            status: 200,
            responseText: starbucksComment
            // is there any response text?
        },
        error: {
            status: 401
        }
    },
    
    // Update Comment
    // PUT
    // /api/events/<event id>/comments/<comment id>/
    updateComment: {
        success: {
            status: 200,
            responseText: starbucksComment
        },
        error: {
            status: 401
        }
    },
    
    // Delete Comment
    // DELETE
    // /api/events/<event id>/comments/<comment id>/
    deleteComment: {
        success: {
            status: 200,
            responseText: '{}'
            // is there any response text?
        },
        error: {
            status: 401
        }
    },
    
    
    // *************************************
    // Event ShoppingList Test Responses
    // *************************************
    
    // Get Shopping List
    // GET
    // /api/events/<event id>/shoppinglist/
    getShoppingList: {
        success: {
            status: 200,
            responseText: beachBBQShoppingList
        },
        error: {
            status: 401
        }
    },
    
    // Add Shopping List Item
    // POST
    // /api/events/<event id>/shoppinglist/
    addShoppingListItem: {
        success: {
            status: 200,
            responseText: beachBBQShoppingListWithGrill
        },
        error: {
            status: 401
        }
    },
    
    // Edit Shopping List
    // PUT
    // /api/events/<event id>/shoppinglist/edit/
    editShoppingList: {
        success: {
            status: 200,
            responseText: beachBBQShoppingListWithGrill
        },
        error: {
            status: 401
        }
    },
    
    // Remove Shopping List Item
    // POST
    // /api/events/<event id>/shoppinglist/remove/
    removeShoppingListItem: {
        success: {
            status: 200,
            responseText: beachBBQShoppingList
        },
        error: {
            status: 401
        }
    },
    
    // Get Shopping List Item
    // GET
    // /api/events/<event id>/shoppinglist/<item id>/
    getShoppingListItem: {
        success: {
            status: 200,
            responseText: beachBBQItemGrill
        },
        error: {
            status: 401
        }
    },
    
    // Edit Shopping List Item
    // PUT
    // /api/events/<event id>/shoppinglist/<item id>/
    editShoppingListItem: {
        success: {
            status: 200,
            responseText: beachBBQItemGrill
        },
        error: {
            status: 401
        }
    },
    
    // Delete Shopping List Item
    // DELETE
    // /api/events/<event id>/shoppinglist/<item id>/
    deleteShoppingListItem: {
        success: {
            status: 200
            // is there any response text?
        },
        error: {
            status: 401
        }
    },
    
    
    // *************************************
    // Event Polls Test Responses
    // *************************************
    
    // Get Event Polls
    // GET
    // /api/events/<event id>/polls/
    getEventPolls: {
        success: {
            status: 200,
            responseText: beachBBQPolls
        },
        error: {
            status: 401
        }
    },
    
    // Add Event Poll
    // POST
    // /api/events/<event id>/polls/
    addEventPoll: {
        success: {
            status: 200,
            responseText: beachBBQPolls
            // is there any response text?
        },
        error: {
            status: 401
        }
    },
    
    // Get Event Poll
    // GET
    // /api/events/<event id>/polls/<poll id>/
    getEventPoll: {
        success: {
            status: 200,
            responseText: beachBBQPoll
        },
        error: {
            status: 401
        }
    },
    
    // Delete Poll
    // DELETE
    // /api/events/<event id>/polls/<poll id>/
    deletePoll: {
        success: {
            status: 200,
            responseText: '{}'
            // is there any response text?
        },
        error: {
            status: 401
        }
    },
    
    // Vote in Poll
    // POST
    // /api/events/<event id>/polls/<poll id>/vote/
    voteInPoll: {
        success: {
            status: 200,
            responseText: beachBBQPoll
        },
        error: {
            status: 401
        }
    }
};