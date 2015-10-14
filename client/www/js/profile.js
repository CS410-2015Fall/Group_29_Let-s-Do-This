$(document).ready(function() {
  console.log('Profile ready to Go');
  $("#logoutButton").click(function(){
    console.log('Logging out');
    $("#mainContent").load("login.html");
  });
});
