$(document).ready(function(){

    $("#btn-submit").click(function(){
        var username = $('#username').val();
        var password = $('#password').val();
        var email = $('#email').val();
        var phone = $('#phone').val();
        addUser(username, password, email, phone);
    });
    
    console.log("Create user has loaded");
});

function addUser(username, password, email, phone) {
    createUser(username, password, email, phone, function(resp){
        window.location = "login.html";
    });
}
