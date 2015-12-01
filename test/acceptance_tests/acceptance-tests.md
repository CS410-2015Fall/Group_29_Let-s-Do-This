## Acceptance Tests


### Create User
* Submitting when username/password field is blank produces an Error Message
* Submitting when username/password/email/phone field is invalid produces an Error Message
  * username needs to be only letters and/or numbers
  * phone must be 10 digits (no dashes)
* Submitting with unique username, valid password
  * users are redirected to the login page
  * users can now successfully login using this username

### Logging In
* Submitting when username/password field is blank → Error Message
* Submitting with username that does not exist in database → Error Message
* Submitting using valid username, incorrect password → Error Message
* Submitting using valid username, correct password
  * User will successfully log in and be redirected to home page

### Local Storage
* User can successfully ‘get’ the most up to date, correct:
  * authentication token
  * user ID
  * username
  * email
  * phone
  * friends
* User can successfully update (‘set’):
  * email
  * phone
  * friends

### Home Page
* User is able to see their notifications upon successful login
* Clicking each button on page loads corresponding page
  * Events
  * Notifications
  * Profile
  * Friends (loads popup)
  * Create Event
* Pressing the “Home” button when on other pages returns user to Home page

### Notifications Page
* Only notifications relevant to logged in user are displayed
* Each notification is only displayed once
* Clicking on event notifications redirects the user to the event page
* Notifications are deleted after a user has seen them
  * Deleted notifications are no longer displayed
* A user receives notifications when an event they are involved with (hosting, invited, accepts, declines) has been changed:
* A user also receives a “Time to go!” notification if they configure Google Now 

### Events Page
* Only events relevant to logged in user are displayed
  * relevant events are those where the user is invited, hosting, accepted, or declined
* Each event is only displayed once
* Correct, up to date information is displayed for each event
  * event name
  * date
  * start time
* Clicking on an event navigates to that event’s page

### Create Event
* Clicking “Save” when all fields are blank → Error Message 
* Clicking “Save” when start date/time is in the past → Error Messsage
* Clicking “Save” with an improper date/time → Error
* Clicking the “Find Location” button navigates to the “Venue Search” page
* Clicking “Save” when fields are filled out correctly will successfully create an event
  * user is redirected to event page for that event
* Clicking “Save” after manually filling in the Location field → No Error Message
  * an event will be successfully created, user will be redirected to corresponding event page
* Clicking “Home” does not create an event
  * Previously filled out fields do not persist if clicking “Create Event” again

### Venue Search
* User can navigate back to Create Event page without selecting a location
  * previously filled out fields on Create Event page should persist
* Clicking “Search” with no fields filled out → Error Message
* Clicking “Search” with fields filled out will return venues sorted based on selected radio button
  * Resulting venues are consistent with values inputted in “Search for”, “Near”, “Radius” fields
* Clicking on venue link will navigate to that venue’s Yelp page
  * previously filled out fields, results on Venue Search page should persist when navigating back to app
* Clicking “Select <venue>!” button will navigate back to Create Event page
  * Selected venue name and location will now appear in “Location” field on Create Event page
  * if “Location” field was previously filled out, it will be overridden with venue information chosen in Venue Search
  * other previously filled out fields on Create Event page should persist

### Event Page
* Correct, up to date information is displayed
  * Event name
  * Date and time
  * Location
  * Comments
  * Guest List
  * Shopping List
  * Polls
  * Map
* If hosting event:
  * option to edit event
    * edit event page has option to cancel event
    * after canceling event, redirect to Home page
    * option to invite(/uninvite?) users
    * option to add(/remove?) hosts
* If invited to event:
  * RSVP button for user to indicate if they accept or decline invitation

### Comments
* All comments for an event are loaded
* Each comment shows the text, username of person who posted, and date it was posted
* Users involved in the event are able to post comments
* Users can post multiple comments


### Shopping List/Budget
* only one shopping list loads for each event
* users can see all unclaimed (and claimed) items
* users can see who claimed what item
* those involved with the event can add items to their shopping list
  * users can give an item a name and a price 
  * users have the option to claim a created item immediately, or leave it unclaimed
  * items can have the same name as existing items on the shopping list
* users have the option to claim any unclaimed items
* users cannot claim a claimed item

### Event Poll
* an event can have multiple polls
* users involved with an event can vote on the event's polls
* users are able to vote multiple times on a poll
* users are unable to change their vote on a poll
* users involved with an event can view the results of the event's polls

### User Profile Page
* If viewing own profile:
  * Correct, up to date user information is displayed
    * username
    * email
    * phone number
  * An "edit profile" button is visible
    * clicking on this button brings the user to the "Edit Profile" page
    * upon loading, three input fields (username, email, phone) are visible
      * by default, the fields are filled in with the user's existing information
    * when a user changes any of these fields and presses the "Save Changes button:
      * locally stored user information is updated
      * user is redirected back to their profile page
* If viewing friend’s profile:
  * correct, up to date user information is displayed
    * username
    * email
    * phone number
  * An "unfriend" button is visible. When pressed:
    * the server is updated; user still persists in database (only friend status is removed)
    * viewing unfriended user’s profile looks the same as viewing non-friend’s profile
    * unfriended user no longer appears in user's friend list
      * user no longer sees unfriended user when inviting people to events
* If viewing non-friend’s profile:
  * only username is displayed
  * A "friend" button is visible. When pressed:
    * the server is updated
    * viewing newly friended user's profile looks the same as viewing friend's profile

### Friends (popup)
* Only usernames of user’s friends are displayed
* Each friend only appears once
* Clicking on username navigates to that user’s profile page

