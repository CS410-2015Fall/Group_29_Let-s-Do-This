
var LetsDoThis = LetsDoThis || {};

LetsDoThis.LogInController = function () {

    this.$logInPage = null;
    this.$btnSubmit = null;
    this.$username = null;
    this.$password = null;
    this.homePageId = null;

};

LetsDoThis.LogInController.prototype.init = function() {
    this.$logInPage = $(".page-login");
    this.homePageId = "home.html";
    this.$btnSubmit = $("#btn-submit", this.$logInPage);
    this.$username = $("#username", this.$logInPage);
    this.$password = $("#password", this.$logInPage);
};

LetsDoThis.LogInController.prototype.resetLogInForm = function() {
    this.$username.val("");
    this.$password.val("");
};

LetsDoThis.LogInController.prototype.redirectToHome = function(resp) {
    
    window.location = "home.html";
}

LetsDoThis.LogInController.prototype.getUserInfo = function(id, callback) {

    var authToken = LetsDoThis.Session.getInstance().getAuthToken();

    var urlWithId = "http://159.203.12.88/api/users/"+id+"/";

    $.ajax({
        type: "GET",
        url: urlWithId,
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "JWT " + authToken)
        },
        contentType: 'application/json',
        dataType: 'json',
        success: function (resp) {
            console.log("User info retrieved!");
            LetsDoThis.Session.getInstance().setUserInfo({
                "id": id,
                "username": resp.username,
                "email": resp.email,
                "phone": resp.phone
            });
            LetsDoThis.Session.getInstance().setUserFriends({
                "friends":resp.friends
            });
            console.log("Woohoo!");
            callback(resp);
        },
        error: function(e) {
            console.log(e.message);
        }
    })
}

LetsDoThis.LogInController.prototype.getUserId = function(username, callback, callbackToRedirect) {

    console.log("call to getUserId was successful");

    var authToken = LetsDoThis.Session.getInstance().getAuthToken();

    var postData = {
        "username": username
    }

    $.ajax({
        type: 'POST',
        url: "http://159.203.12.88/api/users/search/",
        data: JSON.stringify( postData),
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "JWT " + authToken)
        },
        contentType: 'application/json',
        dataType: 'json',
        success: function (resp) {
            console.log("User ID retrieved!");
            LetsDoThis.Session.getInstance().setUserId({
                userId: resp.id
            });
            console.log("User ID is "+resp.id);
            callback(resp.id, callbackToRedirect);

        },
        error: function(e) {
            console.log(e.message);
            console.log("User ID was not retrieved");
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
    if (!invalidInput) {
        this.logIn(username, password, this.getUserId);
    }

    
};

// console.log("login-controller has finished running");
// console.log(LetsDoThis);
LetsDoThis.LogInController.prototype.logIn = function(username, password, callback) {
    var postData = {
        "username": username,
        "password": password
    }
    var callbackToInfo = this.getUserInfo;
    var callbackToRedirect = this.redirectToHome;
    console.log(this);

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
            callback(username, callbackToInfo, callbackToRedirect);
        },
        error: function(e) {
            console.log(e.message);
            console.log("user not authenticated");

        }
    });
}