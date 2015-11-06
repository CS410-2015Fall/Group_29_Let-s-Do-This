/*
 * Thanks to MiamiCoder for the tutorial!
 * http://miamicoder.com/2015/user-authentication-in-a-jquery-mobile-and-phonegap-application/
 *
 */

var LetsDoThis = LetsDoThis || {};

$(document).ready(function(){

    console.log(LetsDoThis);

    var logInController = new LetsDoThis.LogInController();

    // console.log("My login controller looks like this: ");
    // console.log(logInController);

    logInController.init();

    // trigger onLogInCommand when login Submit button pressed
    logInController.$btnSubmit.off("tap").on("tap",function() {
        console.log("logging in user");
        logInController.onLogInCommand();
    });

    // Reset login form
    $(document).on("pagecontainerbeforeshow", function (event,ui) {
        if (typeof ui.toPage == "object") {
            switch (ui.toPage.attr("class")) {
                case "page-login":
                    logInController.resetLogInForm();
                    break;
                default:
                    break;
            }
        }
    });


})
