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

// Testing user profile, editing user profile

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
        profileInfo.profileToDisplay(profileId, userId);
        expect(profileInfo.loadLoggedInData).toHaveBeenCalled();
    });
    
    it("should call loadFriendData when profile id is one of user's friends", function() {
        profileId = 20;
        userId = 6;
        spyOn(profileInfo, "loadLoggedInData");
        spyOn(profileInfo, "loadStrangerData");
        profileInfo.profileToDisplay(profileId, userId);
        expect(profileInfo.loadLoggedInData).not.toHaveBeenCalled();
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
        
        setFixtures(sandbox());
        $('#sandbox').append(readFixtures("profilefixture.html"));
    
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