var LetsDoThis = LetsDoThis || {};

LetsDoThis.LogInController = function () {
    
    this.$logInPage = null;
    this.$btnSubmit = null;
    this.$username = null;
    this.$password = null;
    this.$ctnErr = null;
    this.homePageId = null;
    
};

LetsDoThis.LogInController.prototype.init = function() {
    this.$logInPage = $("#page-login");
    this.homePageId = "home.html";
    this.$btnSubmit = $("#btn-submit", this.$logInPage);
    this.$ctnErr = $("#ctn-err", this.$logInPage);
    this.$username = $("#username", this.$logInPage);
    this.$password = $("#password", this.$logInPage);
};

LetsDoThis.LogInController.prototype.resetLogInForm = function() {
    this.$ctnErr.html("");
    this.$username.val("");
    this.$password.val("");
};

LetsDoThis.LogInController.prototype.getUserInfo = function(id) {
    
    var authToken = LetsDoThis.Session.getInstance().getAuthToken();
    
    var postData = {
        "id": id
    }
    
    $.ajax({
        type: "POST",
        url: "http://159.203.12.88/api/users/",
        data: JSON.stringify( postData),
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + authToken.authToken)
        },
        contentType: 'application/json',
        dataType: 'json',
        success: function (resp) {
            console.log("User info retrieved!");
            LetsDoThis.Session.getInstance().setUserInfo({
                "username": resp.username,
                "email": resp.email,
                "phone": resp.phone
            });
            LetsDoThis.Session.getInstance().setUserFriends({
                "friends":resp.friends
            });
            console.log("Woohoo!");
        },
        error: function(e) {
            console.log(e.message);
        }
    })
}

LetsDoThis.LogInController.prototype.getUserId = function(username) {
    
    console.log("call to getUserId was successful");
    
    var authToken = LetsDoThis.Session.getInstance().getAuthToken();
    
    var postData = {
        "username": username
    }
    
    // First, check if authToken was successfully retrieved
    if (!authToken){
        console.log("Token was null - user not authenticated");
        return
    }
    
    $.ajax({
        type: 'POST',
        url: "http://159.203.12.88/api/users/search",
        data: JSON.stringify( postData),
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + authToken.authToken)
        },
        contentType: 'application/json',
        dataType: 'json',
        success: function (resp) {
            console.log("User ID retrieved!");
            LetsDoThis.Session.getInstance().setUserId({
                userId: resp.id
            });
            console.log("User ID is "+resp.id);
            return;
            // console.log("about to make call to get user info");
            this.getUserInfo(resp.id);
            // $.mobile.changePage(me.homePageId);
            
        },
        error: function(e) {
            console.log(e.message);
            console.log("User ID was not retrieved");
            this.$ctnErr.html("<p>Oops! Let's Do This had a problem, and was unable to log you on.</p>");
        }
    })
}

LetsDoThis.LogInController.prototype.onLogInCommand = function() {
    var me = this,
        username = me.$username.val().trim(),
        password = me.$password.val().trim(),
        invalidInput = false;
        
    
    // Flag each invalid field.
    if (username.length === 0){
        invalidInput = true;
    }
    if (password.length === 0) {
        invalidInput = true;
    }   
    
    // Make sure that all the required fields have values.
    if (invalidInput) {
        me.$ctnErr.html("<p>Please enter all the required fields.</p>");
        return;
    }
    
    var postData = {
        "username": username,
        "password": password
    }
    
    $.ajax({
        type: 'POST',
        url: "http://159.203.12.88/login/",
        data: JSON.stringify( postData),
        contentType: 'application/json',
        dataType: 'json',
        success: function (resp) {
            console.log("Request successful!");
            LetsDoThis.Session.getInstance().setAuthToken({
                authToken: resp.token
            });
            
            console.log("auth token returned: "+resp.token);
            console.log("try to get user ID now");
            me.getUserId(username);
        },
        error: function(e) {
            console.log(e.message);
            console.log("user not authenticated");
            me.$ctnErr.html("<p>Oops! Let's Do This had a problem, and was unable to log you on.</>");
        }
    });
};



