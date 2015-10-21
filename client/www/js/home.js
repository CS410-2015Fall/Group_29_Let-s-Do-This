var tempFakeNotificationData = [
  {head:"Notification1",body:"Tom's going to your christmas party!",eventId:"1"},
  {head:"Notification2",body:"Dick invited you to trivia night at the cambie!",eventId:"2"},
  {head:"Notification3",body:"Harry's Birthday Party is today!",eventId:"3"},
  {head:"Notification4",body:"Sally commented on your christmas party",eventId:"4"}];

  var tempFakeEventData = [
    {head:"Event1",body:"this is an event on a day",eventId:""},
    {head:"Event2",body:"another event on another day",eventId:""},
    {head:"Event3",body:"yup, you guessed it",eventId:""},
    {head:"These boxes are cool",body:"because they're generated dynamically from an array of strings",eventId:""}];

    var tempFakeFriends = ["the styling","is clearly","not loading","correctly","click the x","in \"Filter Items...\"","Tom","Dick","Harry","Sally","Wolfgang","Emil","Mathias","Magnus","Jonas","William","Oliver","Noah","Adrian","Tobias","Elias","Daniel","Henrik","Sebastian","Lucas","Martin","Andreas","Benjamin","Leon","Sander","Alexander","Liam","Isak","Jakob","Kristian","Aksel","Julian","Fredrik","Sondre","Johannes","Erik","Marius","Jonathan","Filip"];


    $(document).ready(function() {
      createContentBoxes(tempFakeNotificationData);
      loadFriends();

      $("#notificationsButton").click(function(){
        createContentBoxes(tempFakeNotificationData);
      });
      $("#eventsButton").click(function(){
        getEvents();
      });
      $("#calendarButton").click(function(){
        $("#mainContent").html("");
        $("#mainContent").append("<strong>TODO</strong>");
      });
      $("#createEventButton").click(function(){
        window.location="createEvent.html";
      });
      $("#profileButton").click(function(){

      });
      $("#friendsButton").click(function(){
      });

      $("#box").click(function(){

      });

      handleContentBoxLinks();
    });

    function createContentBoxes(boxes) {
      $("#mainContent").html("");
      $.each( boxes, function( index, value ){
        $("#mainContent").append(
          '<div id="box" eventId="'
          + value.eventId
          +'"><p><strong>'
          + value.head
          + '</strong><br>'
          + value.body
          + '</p></div>');
        });
      }

      function handleContentBoxLinks() {
        $(document).on("click", '#mainContent div', function(e) {
          if ($(this).attr("id") == "box") {
            // generate link from eventId
            alert($(this).attr("eventId"));
          }
        });
      }

      function loadFriends() {
        $("#friends").html();
        $.each( tempFakeFriends, function( index, value ){
          $("#friendList").append(
            '<li><a href="">'
            + value
            +'</a></li>'
          );
        });
      }

      function getEvents(){
        // This will get events from the server AND call createContentBoxes. This is because the ajax call runs async, so we need
        // to create the content boxes after a success
        $.ajax({
          type: 'GET',
          url: "http://159.203.12.88/api/events/",
          dataType: 'json',
          success: function (resp) {
            console.log("Received events");
            var formattedEvents = formatEvents(resp); //Format the results for createContentBoxes
            createContentBoxes(formattedEvents);
          },
          error: function(e) {
            console.log(e.message);
          }
        });
      }

      function formatEvents(eventArray){
        //This function is responsible for putting the events returned from the server into a form createContentBoxes understands
        var arrayLen = eventArray.length;
        var notificationArray = []; //The running array of formatted events from the server
        if(arrayLen == 0){
          //No events, nothing to do
          console.log("No events to form");
          return;
        }
        for(i=0; i<arrayLen; i++){
          var name = eventArray[i].display_name;
          var id = eventArray[i].id;
          var message = eventArray[i].start_date + " to " + eventArray[i].end_date; //We can make this meaningful later

          var object = {
            'head' : name,
            'body' : message,
            'eventID' : id,
          };

          tempFakeEventData.push(object); //This is only temporary (see below)
          //The below line is what we should actually do
          // notificationArray.push(object);
        }

        return tempFakeEventData; //Again, only temporary (see below)
        // return notificationArray;// Do this
      }
