// Local storage of user information after authentication

var LetsDoThis = LetsDoThis || {};

LetsDoThis.Session = (function () {
    var instance;
    
    function init() {
        
        var sessionIdKey = "letsdothis-session";
        var eventIdKey = "letsdothis-event";
        
        return {
            // Public methods and variables.
            
            // store data of logged in user
            // username, email, phone, friends
            setLoggedInUser: function (sessionData) {
                window.localStorage.setItem(sessionIdKey, JSON.stringify(sessionData));
            },
            
            getLoggedInUser: function () {
                var result = null;
                
                try {
                    result = JSON.parse(window.localStorage.getItem(sessionIdKey));
                } catch(e){}
                
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