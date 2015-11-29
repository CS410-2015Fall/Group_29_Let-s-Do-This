// Testing (mock) Ajax calls to server
//
//Template for call:
//describe("Default Ajax Test", function() {
//    var request;
//    var callback;
//    var requestUrl, method, data;
//    var testResponse;
//    
//    beforeEach(function() {
//        callback = jasmine.createSpy('success');
//        
//        // vvvvvvv Make Changes Below vvvvvvv
//        // TODO: add any variables needed to be used as arguments
//        // TODO: call function to test
//        // TODO: set variables 
//        requestUrl = serverUrl + '';
//        method = "POST";
//        data = {};
//        testResponse = testResponses.testTestResponse;
//        // ^^^^^^^ Make Changes Above ^^^^^^^
//        
//        request = jasmine.Ajax.requests.mostRecent();
//      
//        it('Sends the correct request', function (){
//          expect(request.url).toBe(url);
//          expect(request.method).toBe(method);
//          // TODO: check if the line below is still necessary
//          expect(request.data()).toEqual(data);
//        });
//    })
//    
//    describe("on success", function() {
//        beforeEach(function() {
//          request.respondWith(testResponse.success);
//        });
//        it("calls callback", function() {
//          expect(callback).toHaveBeenCalled();
//          // TODO: something else with callback
//          // var callbackArgs = callback.calls.mostRecent().args[0];
//          // expect(callbackArgs.something).toEqual("something");
//        })
//    })
//  
//    describe("on error", function() {
//        beforeEach(function() {
//          request.respondWith(testResponse.error);
//        });
//        it("does not call callback", function() {
//          expect(callback).not.toHaveBeenCalled();
//        })
//    })    
//    
//})

beforeEach(function(){
  jasmine.Ajax.install();
})

afterEach(function(){
  jasmine.Ajax.uninstall();
})

// *************************************************************
//                   Create and Login User
// *************************************************************

describe('Create User', function (){
  var request;
  var callback;
  
  beforeEach(function() {
    callback = jasmine.createSpy('success');
    createUser("Stampy","peanuts","bawoo@test.com","6045555555", callback);
    
    request = jasmine.Ajax.requests.mostRecent();
    
    it('Sends the correct request', function (){
      expect(request.url).toBe(serverUrl+"/api/users/new/");
      expect(request.method).toBe("POST");
      expect(request.data()).toEqual({
        "username": "Stampy",
		"password": "peanuts",
		"email": "bawoo@test.com",
		"phone": "6045555555"});
    });
  })

  describe("on success", function() {
    beforeEach(function() {
      request.respondWith(testResponses.createUserStampy.success);
    });
    it("calls callback", function() {
      expect(callback).toHaveBeenCalled();
      var callbackArgs = callback.calls.mostRecent().args[0];
      expect(callbackArgs.username).toEqual("Stampy");
      expect(callbackArgs.email).toEqual("bawoo@test.com");
      expect(callbackArgs.phone).toEqual("6045555555");
    })
  })
  
  describe("on error", function() {
    beforeEach(function() {
      request.respondWith(testResponses.createUserStampy.error);
    });
    it("does not call callback", function() {
      expect(callback).not.toHaveBeenCalled();
    })
  })
})

describe("Login - Authentication", function(){
  var request;
  var logInController;
  var callback;
  var username;
  var password;
  
  beforeEach(function() {
    username = "Stampy";
    password = "peanuts";
    callback = jasmine.createSpy('success');
    logInController = new LetsDoThis.LogInController();
    logInController.logIn(username, password, callback);

    request = jasmine.Ajax.requests.mostRecent();
    
    it("Sends the correct request", function() {
      expect(request.url).toBe(serverUrl+"/login/");
      expect(request.method).toBe("POST");
      expect(request.data()).toEqual({
        "username": "Stampy",
		"password": "peanuts"});
    })
  });
  
  describe("on success", function() {
    beforeEach(function() {
      console.log(testResponses.logInStampy.success);
      request.respondWith(testResponses.logInStampy.success);
    });
    it("calls callback", function() {
      expect(callback).toHaveBeenCalled();
      var respArg = callback.calls.mostRecent().args[0];
      expect(respArg).toEqual("Stampy");
    })
  });
  
  describe("on error", function() {
    beforeEach(function() {
      request.respondWith(testResponses.logInStampy.error);
    });
    it("should not call callback", function() {
      expect(callback).not.toHaveBeenCalled();
    })
  })
  
})

describe("Login - retrieve user ID", function(){
  var request;
  var logInController;
  var callback;
  var username;
  
  beforeEach(function() {
    username = "Stampy";
    callback = jasmine.createSpy('success');
    logInController = new LetsDoThis.LogInController();
    logInController.getUserId(username, callback);

    request = jasmine.Ajax.requests.mostRecent();
    
    it("Sends the correct request", function() {
      expect(request.url).toBe(serverUrl+"/api/users/search/");
      expect(request.method).toBe("POST");
      expect(request.data()).toEqual({
        "username": "Stampy"});
    });
      
  })

  describe("on success", function() {
    beforeEach(function() {
      request.respondWith(testResponses.userIdStampy.success);
    });
    it("calls callback", function() {
      // let's say that Stampy's user Id is 123
      expect(callback).toHaveBeenCalled();
      var respArg = callback.calls.mostRecent().args[0];
      expect(respArg).toEqual(123);
    })
  });
  
  describe("on error", function() {
    beforeEach(function() {
      request.respondWith(testResponses.userIdStampy.error);
    });
    it("should not call callback", function() {
      expect(callback).not.toHaveBeenCalled();
    })
  })

})

describe("Login - retrieve user info", function() {
  var request;
  var logInController;
  var callback;
  var userId;
  
  beforeEach(function() {
    // Again, let's say Stampy's user Id is 123
    userId = 123;
    logInController = new LetsDoThis.LogInController();
    callback = jasmine.createSpy('success');
    logInController.getUserInfo(userId,callback);
    
    request = jasmine.Ajax.requests.mostRecent();
    
    it("Sends the correct request", function() {
      expect(request.url).toBe(serverUrl+"/api/users/"+userId+"/");
      expect(request.method).toBe("GET");
    })
  });
  
  describe("on success", function() {
    beforeEach(function() {
      request.respondWith(testResponses.userInfoStampy.success);
    });
    it("calls callback", function() {
      // callback is a function that redirects user to home page
      expect(callback).toHaveBeenCalled();
    })
  });
  describe("on error", function() {
    beforeEach(function() {
      request.respondWith(testResponses.userInfoStampy.error);
    });
    it("should not call callback", function() {
      expect(callback).not.toHaveBeenCalled();
    })
  });
  
})


// *************************************************************
//                    User Profile and Friends
// *************************************************************


describe("Get user", function(){
    var request;
    var callback;
    var userId;
  
    beforeEach(function() {
        userId = 20;
        logInController = new LetsDoThis.LogInController();
        callback = jasmine.createSpy('success');
        getUser(userId, callback);
        
        request = jasmine.Ajax.requests.mostRecent();
        
        it("Sends the correct request", function() {
          expect(request.url).toBe(serverUrl+"/api/users/"+userId+"/");
          expect(request.method).toBe("GET");
        })
    });
  
    describe("on success", function() {
      beforeEach(function() {
        request.respondWith(testResponses.userInfoMrPeanutbutter.success);
      });
      it("calls callback", function() {
        expect(callback).toHaveBeenCalled();
        var callbackArgs = callback.calls.mostRecent().args[0];
        expect(callbackArgs.username).toEqual("MrPeanutbutter");
        expect(callbackArgs.email).toEqual("peanutbutter@isoneword.com");
        expect(callbackArgs.phone).toEqual("6041234567");
      })
    });
    
    describe("on error", function() {
      beforeEach(function() {
        request.respondWith(testResponses.userInfoMrPeanutbutter.error);
      });
      it("should not call callback", function() {
        expect(callback).not.toHaveBeenCalled();
      })
    });
    
});

describe("Get all users", function(){
    var request;
    var callback;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        getAllUsers(callback);
        
        request = jasmine.Ajax.requests.mostRecent();
        
        it('Sends the correct request', function (){
          expect(request.url).toBe(serverUrl+"/api/users/new/");
          expect(request.method).toBe("GET");
      });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponses.allUsers.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          var callbackArgs = callback.calls.mostRecent().args[0];
          var callbackMrPB = callbackArgs[0];
          var callbackCat = callbackArgs[1];
          expect(callbackMrPB.username).toEqual("MrPeanutbutter");
          expect(callbackMrPB.email).toEqual("peanutbutter@isoneword.com");
          expect(callbackMrPB.phone).toEqual("6041234567");
          expect(callbackCat.username).toEqual("cat");
          expect(callbackCat.email).toEqual("");
          expect(callbackCat.phone).toEqual("");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponses.allUsers.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })
    
});

describe("Update user info", function(){
    var request;
    var callback;
    var userId;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        userId = 20;
        updateUserInfo(userId, "MrPeanutbutter", "peanutbutter@isoneword.com","6047654321", callback);
        
        request = jasmine.Ajax.requests.mostRecent();
        
        it('Sends the correct request', function (){
          expect(request.url).toBe(serverUrl+"/api/users/"+userId+"/");
          expect(request.method).toBe("PUT");
          expect(request.data()).toEqual({
            "username": "MrPeanutbutter",
            "email": "bawoo@test.com",
            "phone": "6045555555"})
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponses.updateMrPeanutbutterPhone.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          var callbackArgs = callback.calls.mostRecent().args[0];
          expect(callbackArgs.username).toEqual("MrPeanutbutter");
          expect(callbackArgs.email).toEqual("peanutbutter@isoneword.com");
          expect(callbackArgs.phone).toEqual("6047654321");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponses.updateMrPeanutbutterPhone.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })      
});

describe("Add friend", function(){
    var request;
    var callback;
    var userId;
    var friendId;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        userId = 20;
        friendId = 6;
        addFriend(userId, friendId, callback);
        
        request = jasmine.Ajax.requests.mostRecent();
        
        it('Sends the correct request', function (){
          expect(request.url).toBe(serverUrl+"/api/users/"+userId+"/");
          expect(request.method).toBe("PUT");
          expect(request.data()).toEqual({
            "friends": [friendId.toString()]})
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponses.addShaybeauAsFriend.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          var callbackArgs = callback.calls.mostRecent().args[0];
          expect(callbackArgs.username).toEqual("MrPeanutbutter");
          var newFriend = callbackArgs.friends[1];
          expect(newFriend.username).toEqual("shaybeau");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponses.addShaybeauAsFriend.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    

})

describe("Remove friend", function() {
    var request;
    var callback;
    var userId;
    var friendId;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        userId = 20;
        friendId = 6;
        removeFriend(userId,friendId, callback);
        
        request = jasmine.Ajax.requests.mostRecent();
        
        it('Sends the correct request', function (){
          expect(request.url).toBe(serverUrl+"/api/users/"+userId+"/friends/remove/");
          expect(request.method).toBe("POST");
          expect(request.data()).toEqual({
            "friends": [friendId]
            })
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponses.removeShaybeauAsFriend.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          var callbackArgs = callback.calls.mostRecent().args[0];
          expect(callbackArgs.username).toEqual("MrPeanutbutter");
          var newFriend = callbackArgs.friends[1];
          expect(newFriend).not.toBeDefined();
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponses.removeShaybeauAsFriend.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
    
})

describe("Delete friend", function() {
    var request;
    var callback;
    var userId;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        userId = 20;
        deleteUser(userId, callback);
        
        request = jasmine.Ajax.requests.mostRecent();
        
        it('Sends the correct request', function (){
          expect(request.url).toBe(serverUrl+"/api/users/"+userId+"/");
          expect(request.method).toBe("DELETE");
      })
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponses.deleteMrPeanutbutter.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponses.deleteMrPeanutbutter.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    

})

// *************************************************************
//                           Events
// *************************************************************


describe("Create Event", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var userId;
    var eventName, startDate, endDate, budget, location, host;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        eventName = "Event";
        startDate = "2015-11-26T23:54:00Z";
        endDate = "2015-11-27T00:54:00Z";
        budget = null;
        location = "Pizza Garden: 5780 University Boulevard, Vancouver";
        userId = 1;
        host = [userId.toString()];
        sendToServer(eventName, startDate, endDate, budget, location, callback);

        requestUrl = serverUrl + '/api/events/';
        method = "POST";
        testResponse = testResponses.createEvent;
        data = {
          "display_name": eventName,
          "start_date": startDate,
          "end_date": endDate,
          "hosts" : host,
          "budget" : budget,
          "location" : location
        }
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
          expect(request.data()).toEqual(data);
        });
        
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          var callbackArgs = callback.calls.mostRecent().args[0];
          expect(callbackArgs.start_date).toEqual(startDate);
          expect(callbackArgs.end_date).toEqual(endDate);
          expect(callbackArgs.hosts).toEqual([userId]);
          expect(callbackArgs.budget).toEqual(null);
          expect(callbackArgs.location).toEqual(location);        
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
    
})

describe("Get All Events", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        getEvents(callback);
        requestUrl = serverUrl + '/api/events/';
        method = "GET";
        testResponse = testResponses.getAllEvents;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
})

describe("Get Changed Events", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        getEvents(callback);
        requestUrl = serverUrl + '/api/events/';
        method = "GET";
        testResponse = testResponses.getAllEvents;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
})

describe("Get Event", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId; 
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        eventId = 46;
        getEvent(eventId, callback);
        requestUrl = serverUrl + '/api/events/'+eventId+'/';
        method = "GET";
        testResponse = testResponses.getEvent;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
    
})

describe("Edit Event", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId, userId, eventName, startDate, endDate, budget, location, host;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        eventId = 48;
        userId = 1;
        eventName = "My Event";
        startDate = "2015-11-26T23:54:00Z";
        endDate = "2015-11-27T00:54:00Z";
        budget = null;
        location = "Pizza Garden: 5780 University Boulevard, Vancouver";
        host = [userId.toString()];
        editEvent(eventId, eventName, startDate, endDate, budget, location, callback);
        
        requestUrl = serverUrl + '/api/events/'+eventId+'/';
        method = "PUT";
        data = {
          "display_name": eventName,
          "start_date": startDate,
          "end_date": endDate,
          "budget": budget,
          "location": location
        };
        testResponse = testResponses.editEvent;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
          expect(request.data()).toEqual(data);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
    
})

describe("Invite to event", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId, userId, userList;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        eventId = 48;
        userId = 6;
        userList = [userId];
        inviteToEvent(eventId, userList, callback);
        requestUrl = serverUrl + '/api/events/'+eventId+'/';
        method = "PUT";
        data = {
          "invites": userList  
        };
        testResponse = testResponses.inviteToEvent;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
          expect(request.data()).toEqual(data);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
    
})

describe("Unnvite to event", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId, userId, userList;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        eventId = 48;
        userId = 6;
        userList = [userId];
        inviteToEvent(eventId, userList, callback);
        requestUrl = serverUrl + '/api/events/'+eventId+'/invites/remove/';
        method = "POST";
        data = {
          "invites": userList  
        };
        testResponse = testResponses.uninviteToEvent;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
          expect(request.data()).toEqual(data);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })      
})

describe("RSVP to event (accept)", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId, userId, userList, rsvpStatus;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        eventId = 48;
        userId = 6;
        userList = [userId.toString()];
        rsvpStatus = true;
        rsvpToEvent(eventId, rsvpStatus, callback);
        requestUrl = serverUrl + '/api/events/'+eventId+'/';
        method = "PUT";
        data = {
          accepts: userList  
        };
        testResponse = testResponses.rsvpToEventAccept;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
          expect(request.data()).toEqual(data);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
 
})

describe("RSVP to event (decline)", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId, userId, userList, rsvpStatus;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        eventId = 48;
        userId = 6;
        userList = [userId.toString()];
        rsvpStatus = false;
        rsvpToEvent(eventId, rsvpStatus, callback);
        requestUrl = serverUrl + '/api/events/'+eventId+'/';
        method = "PUT";
        data = {
          accepts: userList  
        };
        testResponse = testResponses.rsvpToEventDecline;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
          expect(request.data()).toEqual(data);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
 
})

describe("Cancel Event", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        var eventId = 48;
        cancelEvent(eventId, callback);
        requestUrl = serverUrl + '/api/events/'+eventId+'/cancel/';
        method = "POST";
        data = {
          "cancelled": true
        };
        testResponse = testResponses.cancelEvent;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
          expect(request.data()).toEqual(data);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
    
})

describe("Remove user from changed event", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId, userId;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        eventId = 48;
        userId = 1;
        removeFromChanged(eventId, userId, callback);
        
        requestUrl = serverUrl + '/api/events/'+eventId+'/changed/remove/';
        method = "POST";
        data = {
          changed: [userId]
        };
        testResponse = testResponses.removeFromChangedEvent;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
          expect(request.data()).toEqual(data);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
    
})

// *************************************************************
//                       Event Comments
// *************************************************************


describe("Add Comment", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId, author, postDate, content;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        eventId = 46;
        author = {"id": 6, "username": "shaybeau"};
        postDate = "2015-11-23T00:38:48.115000Z";
        content = "Red cups!";
        addComment(eventId, author, postDate, content, callback);
        
        requestUrl = serverUrl + '/api/events/'+eventId+'/comments/';
        method = "POST";
        data = {
          "author": author,
          "post_date": postDate,
          "content": content
        };
        testResponse = testResponses.commentOnEvent;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
          expect(request.data()).toEqual(data);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
    
})

describe("Get All Comments", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        eventID = 46;
        getAllComments(eventId, callback);
        requestUrl = serverUrl + '/api/events/'+eventId+'/comments/';
        method = "GET";
        testResponse = testResponses.getEventComments;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })      
})

describe("Get Comment", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId, commentId;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        

        eventId = 46;
        commentId = 25;
        getComment(eventId, commentId, callback);
        requestUrl = serverUrl + '/api/users/'+eventId+'/comments/'+commentId+'/';
        method = "GET";
        testResponse = testResponses.getEventComment;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
    
})

describe("Update Comment", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId, author, postDate, content, commentId, callback;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        // vvvvvvv Make Changes Below vvvvvvv
        // TODO: add any variables needed to be used as arguments
        // TODO: call function to test
        // TODO: set variables
        eventId = 46;
        author = {"id": 6, "username": "shaybeau"};
        postDate = "2015-11-23T00:38:48.115000Z";
        content = "Red cups!";
        commentId = 25;
        updateComment(eventId, author, postDate, content, commentId, callback);
        requestUrl = serverUrl + '/api/events/'+eventId+'/comments/'+commentId+'/';
        method = "PUT";
        data = {
          "author": author,
          "post_date": postDate,
          "content": content
         };
        testResponse = testResponses.updateComment;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
          expect(request.data()).toEqual(data);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
    
})

describe("Delete Comment", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId, commentId;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        // vvvvvvv Make Changes Below vvvvvvv
        eventId = 46;
        commentId = 25;
        deleteComment(eventId, commentId, callback);
        requestUrl = serverUrl + '/api/events/'+eventId+'/comments/'+commentId+'/';
        method = "DELETE";
        testResponse = testResponses.deleteComment;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
})


// *************************************************************
//                    Event Shopping List
// *************************************************************

describe("Get Shopping List", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        eventId = 42;
        getShoppingList(eventId, callback);
        requestUrl = serverUrl + '/api/events/'+eventId+'/shoppinglist/';
        method = "GET";
        testResponse = testResponses.getShoppingList;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
    
})

describe("Add shopping list item", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId, displayName, quantity, cost, supplier, ready;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        // vvvvvvv Make Changes Below vvvvvvv
        // TODO: add any variables needed to be used as arguments
        // TODO: call function to test
        // TODO: set variables
        eventId = 42;
        displayName = "portable grill";
        quantity = '1.00';
        cost = '50.00';
        supplier = 6;
        ready = true;
        addShoppingListItem(eventId, displayName, quantity, cost, supplier, ready, callback);
        requestUrl = serverUrl + '/api/events/'+eventId+'/shoppinglist/';
        method = "POST";
        data = {
          "display_name": displayName,
          "quantity": quantity,
          "cost": cost,
          "supplier" : supplier,
          "ready" : ready
        };
        testResponse = testResponses.addShoppingListItem;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
          expect(request.data()).toEqual(data);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
    
})

describe("Edit shopping list item", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId, itemId, displayName, quantity, cost, supplier, ready;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        eventId = 42;
        displayName = "portable grill";
        quantity = '1.00';
        cost = '50.00';
        supplier = 6;
        ready = true;
        
        editShoppingListItem(eventId, itemId, displayName, quantity, cost, supplier, ready, callback);
        
        requestUrl = serverUrl + '/api/events/'+eventId+'/shoppinglist/'+itemId;
        method = "POST";
        data = {
          "display_name": displayName,
          "quantity": quantity,
          "cost": cost,
          "supplier": supplier,
          "ready": ready
        };
        testResponse = testResponses.editShoppingListItem;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
          expect(request.data()).toEqual(data);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
    
})


// *************************************************************
//                         Event Polls
// *************************************************************

describe("Get event polls", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        eventId = 42;
        getEventPolls(eventId, callback);
        
        requestUrl = serverUrl + 'api/events/'+eventId+'/polls/';
        method = "GET";
        testResponse = testResponses.getEventPolls;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
    
})


describe("Add Event Poll", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId, question, choices;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        eventId = 42;
        question = "What is love?";
        choices = ["Baby dont hurt me", "Dont hurt me","No more"];
        addEventPoll(eventId, question, choices, callback);
        
        requestUrl = serverUrl + 'api/events/'+eventId+'/polls/';
        method = "POST";
        data = {
          "question": question,
          "poll_choices": choices  
        };
        testResponse = testResponses.addEventPoll;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
          expect(request.data()).toEqual(data);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
    
})

describe("Get event poll", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId, pollId;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        eventId = 42;
        pollId = 1;
        getEventPoll(eventId, pollId, callback);
        
        requestUrl = serverUrl + 'api/events/'+eventId+'/polls/'+pollId+'/';
        method = "GET";
        testResponse = testResponses.getEventPoll;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
    
})

describe("Delete poll", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId, pollId;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        eventId = 42;
        pollId = 1;
        deleteEventPoll(eventId, pollId, callback);
        
        requestUrl = serverUrl + '/api/events/'+eventId+'/polls/'+pollId+'/';
        method = "DELETE";
        testResponse = testResponses.deletePoll;
        // ^^^^^^^ Make Changes Above ^^^^^^^
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
    
})


describe("Vote in poll", function() {
    var request;
    var callback;
    var requestUrl, method, data;
    var testResponse;
    var eventId, pollId, vote;
    
    beforeEach(function() {
        callback = jasmine.createSpy('success');
        
        // vvvvvvv Make Changes Below vvvvvvv
        // TODO: add any variables needed to be used as arguments
        // TODO: call function to test
        // TODO: set variables
        eventId = 42;
        pollId = 1;
        vote = 3;
        voteEventPoll(eventId, pollId, vote, callback);
        
        requestUrl = serverUrl + '/api/events/'+eventId+'/polls/'+pollId+'/vote/';
        method = "POST";
        data = {
          "vote": vote
        };
        testResponse = testResponses.voteInPoll;
        
        request = jasmine.Ajax.requests.mostRecent();
      
        it('Sends the correct request', function (){
          expect(request.url).toBe(url);
          expect(request.method).toBe(method);
          // TODO: check if the line below is still necessary
          expect(request.data()).toEqual(data);
        });
    })
    
    describe("on success", function() {
        beforeEach(function() {
          request.respondWith(testResponse.success);
        });
        it("calls callback", function() {
          expect(callback).toHaveBeenCalled();
          // TODO: something else with callback
          // var callbackArgs = callback.calls.mostRecent().args[0];
          // expect(callbackArgs.something).toEqual("something");
        })
    })
  
    describe("on error", function() {
        beforeEach(function() {
          request.respondWith(testResponse.error);
        });
        it("does not call callback", function() {
          expect(callback).not.toHaveBeenCalled();
        })
    })    
    
})