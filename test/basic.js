// For describe, it and before/after see:
// http://samwize.com/2014/02/08/a-guide-to-mochas-describe-it-and-setup-hooks/
//var assert = require('chai').assert;

//The most basic of tests
//describe('basic tests', function(){
//  assert.equal(1+1, 2);
//  assert.equal(true, 1<2);
//})

describe('testing date formatting', function () {
  var formattedDate = formatTime("2015-11-17", "20:05");
  
  it('Should have a T between date and time', function(){
    expect(formattedDate).toBe("2015-11-17T20:05");
  });
});
