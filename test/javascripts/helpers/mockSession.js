// Mock version of Session.js that does not use local storage

var LetsDoThis = LetsDoThis || {};

LetsDoThis.Session = (function () {
  var instance;
  var authToken;
  var userId;
  var userInfo;
  var userFriends;
  
  var profileId;
  var isCordova;
  
  function init() {
    
    authToken = "";
    userId = 0;
    profileId = 0;
    userInfo = {};
    userFriends = [];
    isCordova = false;
 

    return {
      // Public methods and variables.

      // authentication token
      // getAuthToken returns <token>
      setAuthToken: function (sessionData) {
        authToken = sessionData;
      },

      getAuthToken: function () {
        return authToken;
      },

      // user ID
      // getUserId returns <id>
      setUserId: function (sessionData) {
        userId = sessionData;
      },

      getUserId: function () {
        return userId;
      },

      // user information
      // getUserInfo returns {id:<id>, username:<username>, email:<email>, phone:<phone>}
      setUserInfo: function(sessionData) {
        userInfo = sessionData;
      },

      getUserInfo: function() {
        return userInfo;
      },

      // user friends
      // getUserFriends returns
      // <list of {id:<id>,
      //           username:<username>,
      //           email:<email>,
      //           phone:<phone>}>
      setUserFriends: function(sessionData) {
        userFriends = sessionData;
      },

      getUserFriends: function() {
        return userFriends;
      },

      // profile ID
      // getProfileId returns <id>
      setProfileId: function (sessionData) {
        profileId = sessionData;
      },

      getProfileId: function () {
        return profileId;
      },
      
      //Is this session being run as a local app? (As opposed to a mobile or desktop browser)
      getIsCordova: function(){
        return isCordova;
      }
    };
  };

  return {
    getInstance: function () {
      if (!instance) {
        instance = init();
      }
      return instance;
    }
  };
}());
 