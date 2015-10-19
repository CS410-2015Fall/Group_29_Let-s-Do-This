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
    
    // $.mobile.loading("show");
    
    $.ajax({
        type: 'POST',
        // sending to a test server for now
        url: "http://httpbin.org/post",
        // url: LetsDoThis.Settings.logInUrl,
        data: JSON.stringify( { "username": username, "password": password}),
        contentType: 'application/json',
        dataType: 'json',
        success: function (resp) {
            // TODO: verify that user exists in the database
            // TODO: verify that password was correct
            // TODO: determine data to receive from server
            var serverData = jQuery.parseJSON(resp.data);
            LetsDoThis.Session.getInstance().set({
                username: serverData.username
            })
            $.mobile.changePage(me.homePageId);
        },
        error: function(e) {
            console.log(e.message);
            me.$ctnErr.html("<p>Oops! Let's Do This had a problem, and was unable to log you on.");
        }
    });
};



