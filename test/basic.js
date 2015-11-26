describe('testing that this runs', function () {
  var number = 1+1;
  
  it('should be equal', function(){
    expect(number).toBe(2);
  })
})

beforeEach(function() {
  jasmine.Ajax.install();
})

afterEach(function(){
  jasmine.Ajax.uninstall();
})

describe('test creating user', function (){
  var request;
  var callback;
  beforeEach(function() {
    callback = jasmine.createSpy('success');
    createUser("Stampy","peanuts","bawoo@test.com","6045555555", callback);
    
    // confirm that request sent is correct
    request = jasmine.Ajax.requests.mostRecent();

    expect(request.url).toBe("http://159.203.12.88/api/users/new/");
    expect(request.method).toBe("POST");
    expect(request.data()).toEqual({
        "username": "Stampy",
		"password": "peanuts",
		"email": "bawoo@test.com",
		"phone": "6045555555"});
  });
  
  // currently, createUser takes in a callback function
  describe("on success", function() {
    beforeEach(function() {
      request.respondWith(testResponses.createUserStampy.success);
    });
    it("calls callback with created user data", function() {
      console.log("success for create user is "+callback);
      expect(callback).toHaveBeenCalled();
      var callbackArgs = callback.calls.mostRecent().args[0];
      expect(callbackArgs.username).toEqual("Stampy");
      expect(callbackArgs.email).toEqual("bawoo@test.com");
      expect(callbackArgs.phone).toEqual("6045555555");
      
    })
  })
})

describe("test logging in user", function(){
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

    // confirm that request sent is correct
    request = jasmine.Ajax.requests.mostRecent();
    expect(request.url).toBe("http://159.203.12.88/login/");
    expect(request.method).toBe("POST");
    expect(request.data()).toEqual({
        "username": "Stampy",
		"password": "peanuts"});
  });
  describe("on success", function() {
    beforeEach(function() {
      console.log(testResponses.logInStampy.success);
      request.respondWith(testResponses.logInStampy.success);
    });
    it("calls callback with username", function() {
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
      expect(callback.calls.count()).toEqual(0);
    })
  })
})

describe("test retrieving user ID", function(){
  var request;
  var logInController;
  var callback;
  var username;
  var mockToken;
  beforeEach(function() {
    username = "Stampy";
    callback = jasmine.createSpy('success');
    logInController = new LetsDoThis.LogInController();
    logInController.getUserId(username, callback);

    // confirm that request sent is correct
    request = jasmine.Ajax.requests.mostRecent();
    expect(request.url).toBe("http://159.203.12.88/api/users/search/");
    expect(request.method).toBe("POST");
    expect(request.data()).toEqual({
      "username": "Stampy"});
    
  });
  describe("on success", function() {
    beforeEach(function() {
      request.respondWith(testResponses.userIdStampy.success);
    });
    it("calls callback with user Id", function() {
      // let's say that Stampy's user Id is 123
      expect(callback).toHaveBeenCalled();
      var respArg = callback.calls.mostRecent().args[0];
      expect(respArg).toEqual(123);
    })
  });
  describe("on error - no auth token set", function() {
    beforeEach(function() {
      request.respondWith(testResponses.userIdStampy.error);
    });
    it("should not call callback", function() {
      expect(callback.calls.count()).toEqual(0);
    })
  })
})

describe("test retrieving user info", function() {
  var request;
  var logInController;
  var callback;
  var userId;
  beforeEach(function() {
    userId = 123;
    logInController = new LetsDoThis.LogInController();
    callback = jasmine.createSpy('success');
    logInController.getUserInfo(userId,callback);

    // confirm that request sent is correct
    request = jasmine.Ajax.requests.mostRecent();
    expect(request.url).toBe("http://159.203.12.88/api/users/"+userId+"/");
    expect(request.method).toBe("GET");
    
  });
  describe("on success", function() {
    beforeEach(function() {
      request.respondWith(testResponses.userInfoStampy.success);
    });
    it("calls callback with resp as default argument", function() {
      // callback is a function that redirects user to home page
      expect(callback).toHaveBeenCalled();
      var resp = callback.calls.mostRecent().args[0];
      expect(resp.username).toEqual("Stampy");
      expect(resp.email).toEqual("bawoo@test.com");
      expect(resp.phone).toEqual("6045555555");
      expect(resp.friends).toEqual([]);
    })
  });
  describe("on error - no auth token set", function() {
    beforeEach(function() {
      request.respondWith(testResponses.userInfoStampy.error);
    });
    it("should not call callback", function() {
      expect(callback.calls.count()).toEqual(0);
    })
  });
})