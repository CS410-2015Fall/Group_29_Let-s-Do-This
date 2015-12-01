// Testing functions in global.js

describe("Check date and time formatting", function() {
    var date1, timeString, dateString;
    
    it("Formats time properly", function() {
        date1 = new Date("July 21, 2016 01:15:00");
        timeString = convertTime(date1);
        expect(timeString).toEqual("1:15");
        date2 = new Date("July 21, 2016 01:06:00");
        timeString = convertTime(date2);
        expect(timeString).toEqual("1:06");
    });
    
    it("Formats date properly", function() {
        date1 = new Date("July 31, 2017 03:22:11");
        dateString = convertDate(date1);
        expect(dateString).toEqual("Mon Jul 31 2017 at 3:22");
    });
    
    it("Formats two dates properly when one is undefined", function() {
        date1 = "November 30, 2015 12:44:23";
        var date2 = "";
        dateString = convertDate(date1, date2);
        expect(dateString).toEqual("Mon Nov 30 2015 at 12:44");
    });
    
});

// ********************************************************
// Testing create user

describe("Creating user", function(){
    var createUserInfo;
    var spyEvent;
    beforeEach(function() {
        loadCreateUser();
        createUserInfo = CreateUserInfo;
        setFixtures(sandbox());
        $('#sandbox').append(readFixtures("createuserfixture.html"));
        spyOn(createUserInfo, "addUser");
        spyEvent = spyOnEvent('#btn-submit', 'click');

        createUserInfo.buttonLogic();
    });
    
    it("should call addUser on button click", function(){
        $('#btn-submit').click();
        expect(spyEvent).toHaveBeenTriggered();
        expect(createUserInfo.addUser).toHaveBeenCalled();
    });
})

// ********************************************************
// Testing user profile

describe("Button logic for profile view", function() {
    var profileInfo;
    var userId, profileId;
    var addFriend;
    beforeEach(function() {
        profileInfo = new ProfileInfo();
        setFixtures(sandbox());
        $('#sandbox').append(readFixtures("profilefixture.html"));
        LetsDoThis.Session.getInstance().setUserId(2);
        LetsDoThis.Session.getInstance().setProfileId(7);
        loadProfile();
    });
    
    // clicking the homeButton and editButton cause page redirects,
    // which makes Karma sad :(
    
    it("should call addFriend on friend button click", function() {
        var spyEvent = spyOnEvent('#friendButton', 'click');
        spyOn(window, 'addFriend');
        $('#friendButton').click();
        expect(spyEvent).toHaveBeenTriggered();
        expect(window.addFriend).toHaveBeenCalled();
    });
    
    it("should call removeFriend on unfriend button click", function() {
        var spyEvent = spyOnEvent('#unfriendButton', 'click');
        spyOn(window, 'removeFriend');
        $('#unfriendButton').click();
        expect(spyEvent).toHaveBeenTriggered();
        expect(window.removeFriend).toHaveBeenCalled();
    })
});

describe("Determine profile to view", function() {
    var profileInfo;
    var profileId, userId;
    
    beforeEach(function() {
        
        // Create profileInfo object
        profileInfo = new ProfileInfo();

    });
    
    it("should call loadLoggedInData when profile id and user id are the same", function() {
        profileId = 3;
        userId = 3;
        spyOn(profileInfo, "loadLoggedInData");
        spyOn(profileInfo, "loadFriendData");
        spyOn(profileInfo, "loadStrangerData");
        profileInfo.profileToDisplay(profileId, userId);
        expect(profileInfo.loadLoggedInData).toHaveBeenCalled();
        expect(profileInfo.loadFriendData).not.toHaveBeenCalled();
        expect(profileInfo.loadStrangerData).not.toHaveBeenCalled();
    });
    
    it("should call loadFriendData when profile id is one of user's friends", function() {
        LetsDoThis.Session.getInstance().setUserFriends([{id:15},{id:20}]);
        profileId = 20;
        userId = 6;
        spyOn(profileInfo, "loadLoggedInData");
        spyOn(profileInfo, "loadFriendData");
        spyOn(profileInfo, "loadStrangerData");
        profileInfo.profileToDisplay(profileId, userId);
        expect(profileInfo.loadLoggedInData).not.toHaveBeenCalled();
        expect(profileInfo.loadFriendData).toHaveBeenCalled();
        expect(profileInfo.loadStrangerData).not.toHaveBeenCalled();
    });
    
    it("should call loadStrangerData otherwise", function() {
        profileId = 20;
        userId = 6;
        spyOn(profileInfo, "loadLoggedInData");
        spyOn(profileInfo, "loadFriendData");
        profileInfo.profileToDisplay(profileId, userId);
        expect(profileInfo.loadLoggedInData).not.toHaveBeenCalled();
        expect(profileInfo.loadFriendData).not.toHaveBeenCalled();
    });
    
    afterEach(function(){
        LetsDoThis.Session.getInstance().setUserFriends([]);
    });
})

describe("User profile view", function() {
    var profileInfo;
    
    beforeEach(function() {
        
        profileInfo = new ProfileInfo();
        
        it("should have things that exist", function() {
            expect($('#homeButton')).toExist();
        });
        
        it("should not have any buttons in view", function() {
            expect($('#editButton')).toBeHidden();
            expect($('#friendButton')).toBeHidden();
            expect($('#unfriendButton')).toBeHidden();
        });
        
        it("should not have anything in mainContent", function() {
            expect($('#mainContent')).toBeEmpty();
        });
        
        setFixtures(sandbox());
        $('#sandbox').append(readFixtures("profilefixture.html"));

        var userData = {
            "username": "MrPeanutbutter",
            "phone": "6041234567",
            "friends": [
                {
                    "username": "cat",
                    "phone": "",
                    "id": 21,
                    "email": ""
                },
                {
                    "username": "shaybeau",
                    "phone": "6047654324",
                    "id": 6,
                    "email": "shayshay@email.com"
                }
            ],
            "id": 20,
            "email": "peanutbutter@isoneword.com"
        };
        
        profileInfo.loadLoggedInData(userData);
    });

    
    it("should have only edit button visible", function() {
        expect($('#editButton')).toBeVisible();
        expect($('#friendButton')).toBeHidden();
        expect($('#unfriendButton')).toBeHidden();        
    });
    
    it("should have things in mainContent", function() {
        expect($('#mainContent')).not.toBeEmpty();
    });
    
    afterEach(function(){
        profileInfo.clearProfile();
        
        it("should have things that exist still", function() {
            expect($('#homeButton')).toExist();
        });
        
        it("should not have any buttons in view anymore", function() {
            expect($('#editButton')).toBeHidden();
            expect($('#friendButton')).toBeHidden();
            expect($('#unfriendButton')).toBeHidden();
        });
        
        it("should not have anything anymore in mainContent", function() {
            expect($('#mainContent')).toBeEmpty();
        });
    }); 
});

describe("Friend profile view", function() {
    
    var profileInfo;
    
    beforeEach(function() {
        
        profileInfo = new ProfileInfo();
        
        it("should have things that exist", function() {
            expect($('#homeButton')).toExist();
        });
        
        it("should not have any buttons in view", function() {
            expect($('#editButton')).toBeHidden();
            expect($('#friendButton')).toBeHidden();
            expect($('#unfriendButton')).toBeHidden();
        });
        
        it("should not have anything in mainContent", function() {
            expect($('#mainContent')).toBeEmpty();
        });
        
        setFixtures(sandbox());
        $('#sandbox').append(readFixtures("profilefixture.html"));
    
        var friendData = {
            "username": "MrPeanutbutter",
            "phone": "6041234567",
            "id": 20,
            "email": "peanutbutter@isoneword.com"
        };
        
        profileInfo.loadFriendData(friendData);
    });

    
    it("should have only unfriend button visible", function() {
        expect($('#editButton')).toBeHidden();
        expect($('#friendButton')).toBeHidden();
        expect($('#unfriendButton')).toBeVisible();        
    });
    
    it("should have things in mainContent", function() {
        expect($('#mainContent')).not.toBeEmpty();
    });
    
    afterEach(function(){
        profileInfo.clearProfile();
        it("should have things that exist still", function() {
            expect($('#editButton')).toExist();
        });
        
        it("should not have any buttons in view anymore", function() {
            expect($('#editButton')).toBeHidden();
            expect($('#friendButton')).toBeHidden();
            expect($('#unfriendButton')).toBeHidden();
        });
        
        it("should not have anything anymore in mainContent", function() {
            expect($('#mainContent')).toBeEmpty();
        });
    });
    
});

describe("Stranger profile view", function() {
    
    var profileInfo;
    
    beforeEach(function() {
        
        profileInfo = new ProfileInfo();
        
        setFixtures(sandbox());
        $('#sandbox').append(readFixtures("profilefixture.html"));
        
        it("should have things that exist", function() {
            expect($('#editButton')).toExist();
        });
        
        it("should not have any buttons in view", function() {
            expect($('#editButton')).toBeHidden();
            expect($('#friendButton')).toBeHidden();
            expect($('#unfriendButton')).toBeHidden();
        });
        
        it("should not have anything in mainContent", function() {
            expect($('#mainContent')).toBeEmpty();
        });
        

    
        var username = "MrPeanutbutter";
        profileInfo.loadStrangerData(username);
    });

    
    it("should have only friend button visible", function() {
        expect($('#editButton')).toBeHidden();
        expect($('#friendButton')).toBeVisible();
        expect($('#unfriendButton')).toBeHidden();        
    });
    
    it("should have things in mainContent", function() {
        expect($('#mainContent')).not.toBeEmpty();
    });
    
    afterEach(function(){
        profileInfo.clearProfile();
        it("should have things that exist still", function() {
            expect($('#editButton')).toExist();
        });
        
        it("should not have any buttons in view anymore", function() {
            expect($('#editButton')).toBeHidden();
            expect($('#friendButton')).toBeHidden();
            expect($('#unfriendButton')).toBeHidden();
        });
        
        it("should not have anything anymore in mainContent", function() {
            expect($('#mainContent')).toBeEmpty();
        });
    }); 
});


// ***********************************************************
// Testing editing user profile

describe("Edit User Profile", function(){
    var userId, uname, mail, phonenum;
    beforeEach(function(){
        userId = 6;
        uname = "shaybeau";
        mail = "shayshay@email.com";
        phonenum = "1234567890";
        setFixtures(sandbox());
        $('#sandbox').append(readFixtures("editprofilefixture.html"));
        LetsDoThis.Session.getInstance().setUserId(userId);
        LetsDoThis.Session.getInstance().setUserInfo({id:userId, username:uname, email:mail, phone:phonenum});
    });
    
    // Home and back have page redirects, so can't be tested
    
    it("loads current data correctly", function(){
        loadCurrentData();
        expect($('#editUsername')).toHaveValue(uname);
        expect($('#editEmail')).toHaveValue(mail);
        expect($('#editPhone')).toHaveValue(phonenum);
    });
    
    it("clears profile properly", function() {
        clearProfile();
        
        it("should not have any buttons in view anymore", function() {
            expect($('#editButton')).toBeHidden();
            expect($('#friendButton')).toBeHidden();
            expect($('#unfriendButton')).toBeHidden();
        });
        
        it("should not have anything anymore in mainContent", function() {
            expect($('#mainContent')).toBeEmpty();
        });
    });
    
    it("can make a call to send edit profile requests to server", function() {
        spyOn(window, "updateUserInfo");
        var editedUsername = "sheabo";
        var editedEmail = "email@shayshay.com";
        var editedPhone = "9080706050";
        editUserData(editedUsername, editedEmail, editedPhone);
        expect(window.updateUserInfo).toHaveBeenCalled();
    });
    
    it("will call editUserData when save button is pressed", function() {
        spyOn(window, "editUserData");
        loadEditProfile();
        $("#saveButton").click();
        expect(window.editUserData).toHaveBeenCalled();
    });
});


// Login related tests

describe("Non-Ajax login tests", function(){
    var logInController;
    beforeEach(function(){
        setFixtures(sandbox());
        $('#sandbox').append(readFixtures("loginfixture.html"));
        logInController = new LetsDoThis.LogInController();
        logInController.init();
        spyOn(logInController, "logIn");
    });
    
    it("can reset field values", function(){
        $("#username").val("something");
        $("#password").val("woooo");
        logInController.resetLogInForm();
        expect($('#username')).toHaveValue("");
        expect($('#password')).toHaveValue("");
    });
    
    describe("will check for invalid input", function(){

        it("no username and password given", function(){
            $("#username").val("");
            $("#password").val("");
            logInController.onLogInCommand();
            expect(logInController.logIn).not.toHaveBeenCalled();
        });
        it("no password given", function(){
            $("#username").val("something");
            $("#password").val("");
            logInController.onLogInCommand();
            expect(logInController.logIn).not.toHaveBeenCalled();
        });
        it("username and password given", function(){
            $("#username").val("something");
            $("#password").val("blah");
            logInController.onLogInCommand();
            expect(logInController.logIn).toHaveBeenCalled();
        });
    });
});