// Local storage of user information after authentication
// LetsDoThis is a Singleton

var LetsDoThis = LetsDoThis || {};

LetsDoThis.Session = (function () {
    var instance;
    
    function init() {
        
        var sessionIdKey = "letsdothis-session";
        var userIdKey = "letsdothis-userID";
        var eventIdKey = "letsdothis-event";
        var userInfoKey = "letsdothis-userInfo";
        var userFriendsKey = "letsdothis-userFriends";
        
        return {
            // Public methods and variables.
            
            // authentication token
            setAuthToken: function (sessionData) {
                window.localStorage.setItem(sessionIdKey, JSON.stringify(sessionData));
            },
            
            getAuthToken: function () {
                var result = null;
                
                try {
                    result = JSON.parse(window.localStorage.getItem(sessionIdKey));
                } catch(e){}
                
                return result;
            },
            
            // user ID
            
            setUserId: function (sessionData) {
                window.localStorage.setItem(userIdKey, JSON.stringify(sessionData));
            },
            
            getUserId: function (sessionData) {
                var result = null;
                
                try {
                    result = JSON.parse(window.localStorage.getItem(eventIdKey));
                } catch(e){}
                
                return result;
            },
            
            // user information
            
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
            
            setUserFriends: function(sessionData) {
                window.localStorage.setItem(userFriendsKey, JSON.stringify(sessionData));
            },
            
            getUserFriends: function(sessionData) {
                var result = null;
                
                try {
                    result = JSON.parse(window.localStorage.getItem(userFriendsKey));
                } catch(e) {}
                
                return result;
            },
            
            
            // store current event information
            // display_name, start_date, end_date, budget, location,
            // hosts, invites, accepts, declines
            setEvent: function (sessionData) {
                window.localStorage.setItem(eventIdKey, JSON.stringify(sessionData));
            },
            
            getEvent: function (sessionData) {
                var result = null;
                
                try {
                    result = JSON.parse(window.localStorage.getItem(eventIdKey));
                } catch(e){}
                
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