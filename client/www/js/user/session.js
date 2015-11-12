// Local storage of user information after authentication

var LetsDoThis = LetsDoThis || {};

LetsDoThis.Session = (function () {
  var instance;

  function init() {

    var sessionIdKey = "letsdothis-session";
    var userIdKey = "letsdothis-userID";
    var userInfoKey = "letsdothis-userInfo";
    var userFriendsKey = "letsdothis-userFriends";

    return {
      // Public methods and variables.

      // authentication token
      // getAuthToken returns <token>
      setAuthToken: function (sessionData) {
        window.localStorage.setItem(sessionIdKey, JSON.stringify(sessionData));
      },

      getAuthToken: function () {
        var result = null;

        try {
          var storedData = JSON.parse(window.localStorage.getItem(sessionIdKey));
          result = storedData.authToken;
        } catch(e){}

        return result;
      },

      // user ID
      // getUserId returns <id>
      setUserId: function (sessionData) {
        window.localStorage.setItem(userIdKey, JSON.stringify(sessionData));
      },

      getUserId: function () {
        var result = null;

        try {
          var storedData = JSON.parse(window.localStorage.getItem(userIdKey));
          result = storedData.userId;
        } catch(e){}

        return result;
      },

      // user information
      // getUserInfo returns {id:<id>, username:<username>, email:<email>, phone:<phone>}
      setUserInfo: function(sessionData) {
        window.localStorage.setItem(userInfoKey, JSON.stringify(sessionData));
      },

      getUserInfo: function() {
        var result = null;

        try {
          result = JSON.parse(window.localStorage.getItem(userInfoKey));
        } catch(e){}

        return result;
      },

      // user friends
      // getUserFriends returns
      // <list of {id:<id>,
      //           username:<username>,
      //           email:<email>,
      //           phone:<phone>}>
      setUserFriends: function(sessionData) {
        window.localStorage.setItem(userFriendsKey, JSON.stringify(sessionData));
      },

      getUserFriends: function() {
        var result = null;

        try {
          var storedData = JSON.parse(window.localStorage.getItem(userFriendsKey));
          result = storedData.friends;
        } catch(e) {}

        return result;
      },

      //Is this session being run as a local app? (As opposed to a mobile or desktop browser)
      getIsCordova: function(){
        return document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1; //This isn't foolproof, but is near the best at the moment
      },
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

// console.log("Session has finished running. Final LDT:");
// console.log(LetsDoThis);
