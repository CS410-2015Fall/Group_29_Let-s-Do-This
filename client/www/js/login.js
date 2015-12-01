
/*
 * Thanks to MiamiCoder for the tutorial!
 * http://miamicoder.com/2015/user-authentication-in-a-jquery-mobile-and-phonegap-application/
 *
 */

var LetsDoThis = LetsDoThis || {};

$(document).ready(function(){

    var logInController = new LetsDoThis.LogInController();

    logInController.init();

    $("#createUserButton").click(function(){
      window.location = "createUser.html";
    });
    
    // trigger onLogInCommand when login Submit button pressed
    logInController.$btnSubmit.off("tap").on("tap",function() {
        logInController.onLogInCommand();
    });

    // Reset login form
    $(document).on("pagecontainerbeforeshow", function (event,ui) {
        if ((typeof ui.toPage == "object") && (ui.toPage.attr("class") == "page-login")) {
                    logInController.resetLogInForm();
            };
    });
});
