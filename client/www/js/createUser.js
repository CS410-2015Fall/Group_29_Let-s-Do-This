$.getScript("js/global.js", function () {
  initializeScripts(loadCreateUser);
});

function loadCreateUser(){
    $(document).ready(function(){
        CreateUserInfo.buttonLogic();
    });
};

var CreateUserInfo = {
  username: "",
  password: "",
  email: "",
  phone: "",
  addUser: function(username, password, email, phone) {
    createUser(username, password, email, phone, function(resp){
        window.location = "login.html";
    });
  },
  buttonLogic: function(){

    $("#btn-submit").click(function(){
        username = $('#username').val();
        password = $('#password').val();
        email = $('#email').val();
        phone = $('#phone').val();
        CreateUserInfo.addUser(username, password, email, phone);
    });
  }
}; 



