describe('testing that this runs', function () {
  var number = 1+1;
  
  it('should be equal', function(){
    expect(number).toBe(2);
  })
})

describe('testing retrieving user from database', function (){
  var request;
  var callback;
  var value;
  beforeEach(function() {
    jasmine.Ajax.install();
    callback = jasmine.createSpy('callback');
    createUser("Stampy","","bawoo@test.com","6045555555", callback);
  
    request = jasmine.Ajax.requests.mostRecent();
    console.log("Before each request is :" +request);
  });
  it('should be a POST request', function(){
    console.log("Regular request is :"+request);
    expect(request.method).toBe("POST");
  })
})