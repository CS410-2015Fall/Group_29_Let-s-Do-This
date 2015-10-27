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

            getUserId: function (sessionData) {
                var result = null;

                try {
                    var storedData = JSON.parse(window.localStorage.getItem(userIdKey));
                    result = storedData.userId;
                } catch(e){}

                return result;
            },

            // user information
            // getUserInfo returns {username:<username>, email:<email>, phone:<phone>}
            setUserInfo: function(sessionData) {
                window.localStorage.setItem(userInfoKey, JSON.stringify(sessionData));
            },

            getUserInfo: function(sessionData) {
                var result = null;

                try {
                    result = JSON.parse(window.localStorage.getItem(userInfoKey));
                } catch(e){}

                return result;
            },

            // user friends
            // getUserFriends returns <list of user IDs>
            setUserFriends: function(sessionData) {
                window.localStorage.setItem(userFriendsKey, JSON.stringify(sessionData));
            },

            getUserFriends: function(sessionData) {
                var result = null;

                try {
                    var storedData = JSON.parse(window.localStorage.getItem(userFriendsKey));
                    result = storedData.friends;
                } catch(e) {}

                return result;
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

console.log("Session has finished running. Final LDT:");
console.log(LetsDoThis);
