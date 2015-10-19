/*
 * Thanks to MiamiCoder for the tutorial!
 * http://miamicoder.com/2015/user-authentication-in-a-jquery-mobile-and-phonegap-application/
 *
 */

var LetsDoThis = LetsDoThis || {};

var logInController = new LetsDoThis.LogInController();

// Reset login form
$(document).on("pagecontainerbeforeshow", function (event,ui) {
    if (typeof ui.toPage == "object") {
        switch (ui.toPage.attr("id")) {
            case "page-login":
                logInController.resetLogInForm();
                break;
            default:
                break;
        }
    }
});

// trigger onLogInCommand when login Submit button pressed
$(document).delegate("#page-login", "pagebeforecreate", function() {
    logInController.init();
    logInController.$btnSubmit.off("tap").on("tap",function() {
        console.log("logging in user");
        logInController.onLogInCommand();
    });
})